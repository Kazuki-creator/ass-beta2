import setupForm from "/js/main-form.js";
import generateSeminarStructurePrompt from './seminar-structure_prompt.js';

setupForm({
  formId: "seminar-structure-form",
  inputIds: [
    "desiredAction",
    "targetAttributes",
    "theme",
    "benefit",
    "uniquePoint",
    "atmosphere",
    "format",
    "avoidance"
  ],
  requiredIds: [
    "desiredAction",
    "targetAttributes",
    "theme",
    "benefit",
    "uniquePoint",
    "atmosphere",
    "format",
    "avoidance"
  ],
  featureName: "seminar-structure",
  promptFn: generateSeminarStructurePrompt,
  steps: [
    "🔍 データ解析中...",
    "📋 構成案作成中...",
    "🛠 最適化中...",
    "✅ 完了！"
  ]
});
