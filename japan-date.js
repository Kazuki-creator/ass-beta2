// japan-date.js 
  // JST（日本時間）に変換
function getJpDateStringJST(date = new Date()) {
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const y  = jst.getFullYear();
  const m  = (jst.getMonth() + 1).toString().padStart(2, '0');
  const d  = jst.getDate().toString().padStart(2, '0');
  const hh = jst.getHours().toString().padStart(2, '0');
  const mm = jst.getMinutes().toString().padStart(2, '0');

  return `${y}年${m}月${d}日 ${hh}:${mm}`;
}

module.exports = getJpDateStringJST;
