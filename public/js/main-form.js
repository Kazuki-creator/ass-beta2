// public/js/main-form.js

import { ensureSession } from './session.js';
import { formatResponseText } from './markdown.js';

/**
 * サイドバーSPAカテゴリフィルタ
 * トップページ（.items-containerが存在）のみpreventDefaultし、子ページはリンク遷移
 */
export function setupSidebarFilter() {
  console.log('[debug] setupSidebarFilter CALLED');
  const isTopPage = !!document.querySelector('.items-container');
  const sidebar = document.getElementById("sidebar-container");
  console.log('[debug] sidebar-container取得:', !!sidebar);

  function filterItemsByCategory(cat) {
    document.querySelectorAll(".items-container .item").forEach(item => {
      if (!cat || item.dataset.category === cat) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }
  function setSidebarActiveClass(cat) {
    document.querySelectorAll("#sidebar-container [data-cat]").forEach(a => {
      a.classList.toggle("active", a.getAttribute("data-cat") === cat);
    });
  }

  if (sidebar) {
    sidebar.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      const cat = link.getAttribute("data-cat");
      if (cat) {
        if (isTopPage) {
          // トップページのみpreventDefault（SPAフィルタ）
          e.preventDefault();
          filterItemsByCategory(cat);
          setSidebarActiveClass(cat);
          const url = new URL(window.location);
          url.searchParams.set("category", cat);
          window.history.replaceState({}, "", url);
        }
        // 子ページは何もしない
      } else if (link.getAttribute("target") === "_blank") {
        // 新規タブはなにもしない（デフォルト挙動＝新規タブで開く）
        return;
      } else {
        // その他（内部リンク等）は常にpreventDefaultでwindow.location遷移
        e.preventDefault();
        window.location.href = link.getAttribute("href");
      }
    });
  }


  // トップページのみ初回ロード時フィルタ＆active適用
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("category");
  if (catParam && isTopPage) {
    filterItemsByCategory(catParam);
    setSidebarActiveClass(catParam);
  }
}

/**
 * フォームセットアップ関数（各ページで個別import・実行）
 */
export default function setupForm({
  formId,
  inputIds,
  requiredIds = [],
  featureName,
  promptFn,
  steps = [],
  beforeSubmit,
  afterOutput
}) {
  document.addEventListener("DOMContentLoaded", () => {
    try { ensureSession(); } catch { return; }

    const outputContainer = document.getElementById("output-container");
    const outputElement   = document.getElementById("output");

    // --------- ここから下はフォームがあるページのみ ---------
    const form = document.getElementById(formId);
    if (!form) return;

    // 進捗バー/ステップ関連
    const progressFill = document.getElementById("progress-fill");
    const stepElements = steps.length
      ? steps.map((_, i) => document.getElementById(`step-${i + 1}`))
      : [];

    function updateProgressStep(stepNumber, message) {
      if (!steps.length || !progressFill || !stepElements.length) return;
      const progressPercentage = steps.length === 1
        ? 100
        : ((stepNumber - 1) / (steps.length - 1)) * 100;
      progressFill.style.width = `${progressPercentage}%`;
      stepElements.forEach((el, idx) => {
        if (!el) return;
        el.classList.remove("active", "completed");
        if (idx + 1 < stepNumber) el.classList.add("completed");
        if (idx + 1 === stepNumber) el.classList.add("active");
      });
      if (outputElement && message)
        outputElement.innerHTML = `<p class='loading-text'>${message}</p>`;
    }

    function resetProgress() {
      if (!steps.length || !progressFill || !stepElements.length) return;
      progressFill.style.width = "0%";
      stepElements.forEach(el => el && el.classList.remove("active", "completed"));
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      try { ensureSession(); } catch { return; }

      // --- 入力値まとめ ---
      const userInputs = {};
      for (const id of inputIds) {
        const el = document.getElementById(id);
        userInputs[id] = el ? el.value.trim() : "";
      }

      // --- 必須チェック ---
      for (const rid of requiredIds) {
        if (!userInputs[rid]) {
          const el = document.getElementById(rid);
          if (el) el.focus();
          alert("未入力項目があります。全てご入力ください。");
          return;
        }
      }

      if (beforeSubmit) {
        const result = beforeSubmit(userInputs);
        if (result === false) return;
      }

      const promptText = promptFn(userInputs);

      if (outputContainer) {
        outputContainer.style.display = "block";
        outputContainer.classList.remove('active');
      }
      if (outputElement) outputElement.textContent = "🤖 AIが考え中...";

      resetProgress();
      if (steps.length > 0) updateProgressStep(1, steps[0]);

      let progressTimers = [];
      if (steps.length > 2) {
        for (let i = 1; i < steps.length - 1; i++) {
          const timer = setTimeout(() => {
            updateProgressStep(i + 1, steps[i]);
          }, i * 6000);
          progressTimers.push(timer);
        }
      }

      try {
        const response = await fetch("/api/deepseek", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: promptText, feature: featureName })
        });

        const data = await response.json();
        if (!data.reply) throw new Error("AIからの返信がありません");

        progressTimers.forEach(timer => clearTimeout(timer));
        if (steps.length > 0) {
          updateProgressStep(steps.length, steps[steps.length - 1]);
        }

        if (outputContainer) {
          outputContainer.style.display = "block";
          outputContainer.classList.add('active');
        }
        if (outputElement) outputElement.innerHTML = formatResponseText(data.reply);

        await fetch("/api/log-to-notion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            feature: featureName,
            input: JSON.stringify(userInputs),
            output: data.reply
          })
        });

        if (afterOutput) afterOutput(data, userInputs);

      } catch (err) {
        if (outputElement) outputElement.textContent = "⚠️ エラーが発生しました";
        resetProgress();
        console.error("[main-form.js] DeepSeek/Notion連携エラー", err);
      }
    });

    // --- クリップボードコピー機能 ---
    const copyBtn = document.getElementById("copy-btn");
    const copySuccess = document.getElementById("copy-success");
    const analysisOutput = document.getElementById("analysis-output");
    const outputElementOrAnalysis = analysisOutput || outputElement;

    if (copyBtn && outputElementOrAnalysis) {
      copyBtn.addEventListener("click", () => {
        const textToCopy = outputElementOrAnalysis.innerText || "";
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            if (copySuccess) {
              copySuccess.classList.add("show");
              setTimeout(() => copySuccess.classList.remove("show"), 2000);
            }
          })
          .catch(err => console.error("[debug] コピーに失敗:", err));
      });
    }

    const returnBtn = document.getElementById("return-home");
    if (returnBtn) {
      returnBtn.addEventListener("click", (e) => {
        e.preventDefault();
        try { ensureSession(); } catch { return; }
        // クッキーからプラン取得
        let plan = 'Basic';
        try {
          const kv = document.cookie.split('; ').find(v=>v.startsWith('userSession='));
          if(kv) plan = JSON.parse(decodeURIComponent(kv.split('=')[1])).plan;
        } catch{}
        const home =
          (plan === 'Pro')   ? '/index.html'
        : (plan === 'Basic') ? '/basic.html'
        : (plan === 'Trial') ? '/trial.html'
        : '/login.html';
        window.location.href = home;
      });
    }
    
    // --------- ここまでフォーム専用 ---------
  });
}
