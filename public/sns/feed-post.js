import setupForm from '/js/main-form.js';
import generateFeedPostPrompt from './feed-post_prompt.js';

setupForm({
  formId: "feed-post-form",
  inputIds: ["content", "story", "message", "target", "goal"],
  requiredIds: ["content", "story", "message", "target", "goal"],
  featureName: "feed-post",
  promptFn: generateFeedPostPrompt,
  steps: [
    "🔍 データを解析中...",
    "📋 投稿案を作成中...",
    "🛠 最適化中...",
    "✅ 完了！"
  ]
});
