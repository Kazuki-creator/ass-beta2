import setupForm from '/js/main-form.js';
import generateLPSessionPrompt from './lp-session_prompt.js';

setupForm({
  formId: "lp-session-form",
  inputIds: [
    "persona",
    "recruitment",
    "profile",
    "episode"
  ],
  requiredIds: [
    "persona",
    "recruitment",
    "profile",
    "episode"
  ],
  featureName: "lp-session",
  promptFn: generateLPSessionPrompt,
  steps: [
    "🔍 データ解析中...",
    "🖋 LP構築中...",
    "🛠 最適化中...",
    "✅ 完了！"
  ]
});
