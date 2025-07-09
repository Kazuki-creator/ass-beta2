import setupForm from '/js/main-form.js';
import generateCatchphrasePrompt from './catchphrase_prompt.js';

// DOMContentLoaded不要（main-form.js内で行う）
setupForm({
  formId: "catchphrase-form",
  inputIds: [
    "target",
    "problem",
    "productName",
    "feature",
    "benefit",
    "futureBenefit",
    "image",
    "extra"
  ],
  requiredIds: [
    "target",
    "problem",
    "productName",
    "feature",
    "benefit",
    "futureBenefit",
    "image"
    // "extra"は任意ならここから除外（必須なら入れる）
  ],
  featureName: "catchphrase",
  promptFn: generateCatchphrasePrompt,
  steps: [
    "🔍 データ解析中...",
    "💡 キャッチコピー生成中...",
    "🛠 最適化中...",
    "✅ 完了！"
  ]
});
