import setupForm from '../js/main-form.js';
import generateSessionAssistPrompt from './session-assist_prompt.js';

setupForm({
  formId: "session-assist-form",
  inputIds: [
    "goal",       // 目標＋期日
    "belief",     // リミティングビリーフ
    "status",     // 状態（1-10）
    "actions",    // 実際の行動
    "result",     // 実績数字
    "resources",  // 使えるリソース
    "homework",   // 宿題達成度
    "note"        // その他補足情報
  ],
  requiredIds: [
    "goal",
    "belief",
    "status",
    "actions",
    "result",
    "resources",
    "homework"
    // noteは任意
  ],
  featureName: "session-assist",
  promptFn: generateSessionAssistPrompt,
  steps: [
    "🔍 データを解析中...",
    "📝 セッション台本を設計中...",
    "🛠 仕上げ・最適化中...",
    "✅ 完了！"
  ]
});
