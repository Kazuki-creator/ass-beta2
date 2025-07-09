import setupForm from "/js/main-form.js";
import generateFreeContentPrompt from "./free-content_prompt.js";

// ページ固有のフォーム初期化
setupForm({
  formId: "free-content-form",
  inputIds: ["content", "persona", "story", "snsMessage"],
  requiredIds: ["content", "persona", "story", "snsMessage"],
  featureName: "free-content",
  promptFn: generateFreeContentPrompt,
  steps: [
    "🔍 データを解析中...",
    "📋 コンテンツ案を作成中...",
    "🛠 最適化中...",
    "✅ 完了！"
  ],
  // 出力先をoutputに統一しているのでoutput-container > #output
  afterOutput: () => {
    // 出力エリア・クリップボードボタンの表示
    const clipboardContainer = document.querySelector(".clipboard-container");
    if (clipboardContainer) clipboardContainer.style.display = "block";
  }
});
