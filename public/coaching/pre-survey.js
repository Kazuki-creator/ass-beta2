import setupForm from '../js/main-form.js';
import generatePreSurveyPrompt from './pre-survey_prompt.js';

setupForm({
  formId: "pre-survey-form",
  inputIds: [
    "purpose",
    "goal",
    "motivation",
    "obstacle",
    "background"
  ],
  requiredIds: [
    "purpose",
    "goal"
  ],
  featureName: "pre-survey",
  promptFn: generatePreSurveyPrompt,
  steps: [
    "🔍 データを解析中...",
    "📝 要素を抽出中...",
    "🛠 最適化中...",
    "✅ 完了！"
  ]
});
