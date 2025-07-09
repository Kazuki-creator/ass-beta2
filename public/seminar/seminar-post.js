import setupForm from '/js/main-form.js';
import generateSeminarPostPrompt from './seminar-post_prompt.js';

// DOMContentLoadedで共通フォームセットアップ
setupForm({
  formId: "seminar-post-form",
  inputIds: [
    "seminarTitle",
    "seminarDatetime",
    "targetInfo",
    "problem",
    "benefit",
    "specialOffer"
  ],
  requiredIds: [
    "seminarTitle",
    "seminarDatetime",
    "targetInfo",
    "problem",
    "benefit",
    "specialOffer"
  ],
  featureName: "seminar-post",
  promptFn: generateSeminarPostPrompt,
  steps: [
    "🔍 データを解析中...",
    "📋 告知文案を作成中...",
    "🛠 最適化中...",
    "✅ 完了！"
  ]
});
