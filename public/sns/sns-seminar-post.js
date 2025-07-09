import setupForm from "/js/main-form.js";
import generateSnsSeminarPostPrompt from './sns-seminar-post_prompt.js';

setupForm({
  formId: "sns-seminar-post-form",
  inputIds: [
    "seminarTitle",
    "seminarDatetime",
    "targetInfo",
    "problem",
    "benefit",
    "specialOffer",
    "recentInsight"
  ],
  requiredIds: [
    "seminarTitle",
    "seminarDatetime",
    "targetInfo",
    "problem",
    "benefit",
    "specialOffer",
    "recentInsight"
  ],
  featureName: "sns-seminar-post",
  promptFn: generateSnsSeminarPostPrompt,
  steps: [
    "データ解析",
    "告知文案作成",
    "最適化",
    "完了"
  ],
  // 出力先をaction-plan準拠でid="output"に
  afterOutput: () => {
    const outputContainer = document.getElementById("output-container");
    const clipboardContainer = document.querySelector(".clipboard-container");
    if (outputContainer) outputContainer.style.display = "block";
    if (clipboardContainer) clipboardContainer.style.display = "block";
  }
});
