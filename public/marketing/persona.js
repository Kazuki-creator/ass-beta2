import setupForm from "/js/main-form.js";
import generatePersonaPrompt from "./persona_prompt.js";

setupForm({
  formId: "persona-form",
  inputIds: [
    "productName",
    "productDetail",
    "price",
    "targetDescription",
    "benefit",
    "trend"
  ],
  requiredIds: [
    "productName",
    "productDetail",
    "price",
    "targetDescription",
    "benefit",
    "trend"
  ],
  featureName: "persona",
  promptFn: generatePersonaPrompt,
  steps: [
    "🔍 データを解析中...",
    "🧑‍🎨 ペルソナ作成中...",
    "🛠 最適化中...",
    "✅ 完了！"
  ]
});
