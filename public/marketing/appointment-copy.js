import setupForm from "/js/main-form.js";
import generateAppointmentCopyPrompt from "./appointment-copy_prompt.js";

setupForm({
  formId: "appointment-copy-form",
  inputIds: [
    "age",
    "gender",
    "family",
    "occupation",
    "relationship",
    "meetingFrequency",
    "lastMeeting",
    "distance",
    "trigger"
  ],
  requiredIds: [
    "age",
    "gender",
    "family",
    "occupation",
    "relationship",
    "meetingFrequency",
    "lastMeeting",
    "distance",
    "trigger"
  ],
  featureName: "appointment-copy",
  promptFn: generateAppointmentCopyPrompt,
  steps: [
    "🔍 データを解析中...",
    "📝 コピー生成中...",
    "🛠 最適化中...",
    "✅ 完了！"
  ]
});
