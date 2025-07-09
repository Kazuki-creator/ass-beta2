import setupForm from "/js/main-form.js";
import generateProfileCopyPrompt from "./profile-copy_prompt.js";

setupForm({
  formId: "profile-copy-form",
  inputIds: [
    "name",
    "expertise",
    "career",
    "background",
    "target",
    "additional"
  ],
  requiredIds: [
    "name",
    "expertise",
    "career",
    "background",
    "target"
  ],
  featureName: "profile-copy",
  promptFn: generateProfileCopyPrompt,
  steps: [
    "🔍 入力情報を解析中...",
    "📝 プロフィール原稿生成中...",
    "🛠 文章を最適化中...",
    "✅ 完了！"
  ]
});
