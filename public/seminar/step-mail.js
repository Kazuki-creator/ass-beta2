import setupForm from "/js/main-form.js";
import generateStepMailPrompt from './step-mail_prompt.js';

setupForm({
  formId: "step-mail-form",
  inputIds: [
    "seminarTitle",
    "seminarDatetime",
    "seminarMethod",
    "targetInfo",
    "benefit",
    "specialOffer"
  ],
  requiredIds: [
    "seminarTitle",
    "seminarDatetime",
    "seminarMethod",
    "targetInfo",
    "benefit",
    "specialOffer"
  ],
  featureName: "step-mail",
  promptFn: generateStepMailPrompt,
  steps: [
    "🔍 データを解析中...",
    "📋 メール案を作成中...",
    "🛠 最適化中...",
    "✅ 完了！"
  ]
});
