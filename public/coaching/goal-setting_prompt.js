/**
 * generateGoalSettingPrompt
 *
 * ユーザーの回答データをもとに、SMARTルールに基づいた目標設定プランのプロンプトを生成します。
 *
 * @param {Object} data - ユーザー回答データ
 *   {
 *     value: ユーザーが大切にする価値観,
 *     future: 理想の将来像,
 *     current: 現在の状況・リソース,
 *     strength: 強み・得意なこと,
 *     ngList: やりたくないこと,
 *     achievedImage: 目標達成後のイメージ,
 *     skills: 身につけたいスキル,
 *     obstacles: 目標達成を邪魔する障害・不安
 *   }
 *
 * @return {string} 生成された目標設定プランのプロンプト
 */
export default function generateGoalSettingPrompt(data) {
  // 未入力の場合はプレースホルダーを利用
  const value = data.value || "【ユーザーからの回答】";
  const future = data.future || "【ユーザーからの回答】";
  const current = data.current || "【ユーザーからの回答】";
  const strength = data.strength || "【ユーザーからの回答】";
  const ngList = data.ngList || "【ユーザーからの回答】";
  const achievedImage = data.achievedImage || "【ユーザーからの回答】";
  const skills = data.skills || "【ユーザーからの回答】";
  const obstacles = data.obstacles || "【ユーザーからの回答】";

  let prompt = "";
  prompt += "【目標設定プランの生成】\n\n";
  prompt += "以下のユーザー回答に基づいて、達成しやすく現実的な目標設定プランを作成してください。\n\n";
  prompt += "① ユーザーが大切にしたい価値観: " + value + "\n";
  prompt += "② ユーザーの理想の将来像: " + future + "\n";
  prompt += "③ 現在の状況・リソース: " + current + "\n";
  prompt += "④ あなたの強み・得意なこと: " + strength + "\n";
  prompt += "⑤ やりたくないこと（NGリスト）: " + ngList + "\n";
  prompt += "⑥ 目標達成後のイメージ: " + achievedImage + "\n";
  prompt += "⑦ 目標達成のために身につけたいスキル: " + skills + "\n";
  prompt += "⑧ 目標達成を邪魔する障害・不安: " + obstacles + "\n\n";
  prompt += "【指示書】\n";
  prompt += "あなたは心理学および目標設定の専門家です。上記の各回答を統合し、SMARTルールに基づいた具体的かつ実践的な目標設定プランを３パターン生成してください。\n";
  prompt += "プランには以下の要素を必ず含めてください：\n";
  prompt += "　・具体的な目標の記述（何を、なぜ達成するのか）\n";
  prompt += "　・成果の測定方法（どのように進捗を評価するのか）\n";
  prompt += "　・利用可能なリソースと実行計画（どのスキルやリソースをどのように活用するか）\n";
  prompt += "　・動機付けと目標の意義（なぜその目標が重要なのか）\n";
  prompt += "　・達成期限とマイルストーン（いつまでに何をするのか）\n";
  prompt += "　・具体的なマイルストーン例（例：1年以内に月商300万円、3ヶ月以内に50万円、1ヶ月以内に30万円を目指す）\n\n";
  prompt += "以上の情報を基に、ユーザーが明確に理解できる段階的な目標設定プランを生成してください。\n";
  prompt += "※文字を大きくしたり装飾はつけずに返してください。見やすくするために改行や線は引いてください。";

  
  return prompt;
}
