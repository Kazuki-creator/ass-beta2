import setupForm from '../js/main-form.js';
import generateDailyFeedbackPrompt from './daily-feedback_prompt.js';

setupForm({
  formId: "daily-feedback-form",
  inputIds: [
    "goal",           // 目標
    "todayActions",   // 今日やったこと
    "todayResult",    // 今日得た結果
    "todayTrouble",   // 今日あったつまずきや課題
    "tomorrowActions" // 明日あなたがやること
  ],
  requiredIds: [
    "goal",
    "todayActions",
    "todayResult",
    "todayTrouble",
    "tomorrowActions"
  ],
  featureName: "daily-feedback",
  promptFn: generateDailyFeedbackPrompt,
  steps: [
    "🔍 データを解析中...",
    "📝 日報内容を理解中...",
    "📋 フィードバックを作成中...",
    "✅ 完了！"
  ]
});
