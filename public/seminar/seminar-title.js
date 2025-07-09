import setupForm from "/js/main-form.js";
import generateSeminarTitlePrompt from "./seminar-title_prompt.js";

setupForm({
  formId: "seminar-title-form",
  inputIds: ["persona", "failedAttempts", "structure"],
  requiredIds: ["persona", "failedAttempts", "structure"],
  featureName: "seminar-title",
  promptFn: generateSeminarTitlePrompt,
  steps: [
    "データ解析中...",
    "タイトル案作成中...",
    "最適化中...",
    "完了！"
  ],
  // 応答エリア出力のためのフック
  afterOutput: (data, userInputs) => {
    // 必要ならここに追加処理
  }
});
