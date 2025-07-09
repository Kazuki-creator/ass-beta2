// remainingDays.js
/**
 * 日本語・各種区切りの日付文字列やDateを受けて「残日数（JST基準）」を返す
 * @param {string|Date} input
 * @returns {number}
 */
export function remainingDays(input) {
  if (!input) return 0;
  let y, m, d;
  if (input instanceof Date) {
    y = input.getFullYear();
    m = input.getMonth() + 1;
    d = input.getDate();
  } else if (typeof input === 'string') {
    // 例: 2025年7月31日
    let match = input.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日?/);
    if (!match) {
      // 例: 2025-07-31, 2025/7/31, 2025.7.31, 2025-7-31 など
      match = input.match(/(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
    }
    if (match) {
      y = Number(match[1]);
      m = Number(match[2]);
      d = Number(match[3]);
    } else {
      return 0; // パースできなければ0
    }
  } else {
    return 0;
  }
  // JSTの0時として日付生成
  const goal = new Date(y, m - 1, d, 0, 0, 0);
  // JSTの今日
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  goal.setHours(0,0,0,0);
  now.setHours(0,0,0,0);
  const diff = Math.ceil((goal - now) / 86400000);
  return Math.max(diff, 0);
}
