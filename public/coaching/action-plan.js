import setupForm from '../js/main-form.js';
import generateActionPlanPrompt from './action-plan_prompt.js';

setupForm({
  formId: "action-plan-form",
  inputIds: [
    "goal",      // 目標
    "skills",    // スキル
    "background" // 背景や動機
  ],
  requiredIds: [
    "goal",
    "skills",
    "background"
  ],
  featureName: "action-plan",
  promptFn: generateActionPlanPrompt,
  steps: [
    "🔍 データを解析中...",
    "📋 計画を作成中...",
    "🛠 最適化中...",
    "✅ 完了！"
  ]
});
