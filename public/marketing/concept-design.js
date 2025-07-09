import setupForm from "/js/main-form.js";
import generateConceptDesignPrompt from "./concept-design_prompt.js";

setupForm({
  formId: "concept-design-form",
  inputIds: [
    "target",
    "idealState",
    "value",
    "productName",
    "features",
    "brandImage"
  ],
  requiredIds: [
    "target",
    "idealState",
    "value",
    "productName",
    "features",
    "brandImage"
  ],
  featureName: "concept-design",
  promptFn: generateConceptDesignPrompt,
  steps: [
    "🔍 データを解析中...",
    "💡 コンセプト作成中...",
    "🛠 最適化中...",
    "✅ 完了！"
  ]
});
