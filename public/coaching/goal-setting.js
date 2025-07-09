import setupForm from '../js/main-form.js';
import generateGoalSettingPrompt from './goal-setting_prompt.js';

setupForm({
  formId: "goal-setting-form",
  inputIds: [
    "value",
    "future",
    "current",
    "strength",
    "ngList",
    "achievedImage",
    "skills",
    "obstacles"
  ],
  requiredIds: [
    "value",
    "future",
    "current"
  ],
  featureName: "goal-setting",
  promptFn: generateGoalSettingPrompt,
  steps: [
    "🔍 データを解析中...",
    "💡 目標プランを作成中...",
    "🛠 最適化中...",
    "✅ 完了！"
  ]
});
