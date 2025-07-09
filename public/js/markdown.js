export function formatResponseText(text) {
  // 見出し1～6
  text = text.replace(/^######\s?(.*)$/gm, "<h6>$1</h6>");
  text = text.replace(/^#####\s?(.*)$/gm, "<h5>$1</h5>");
  text = text.replace(/^####\s?(.*)$/gm, "<h4>$1</h4>");
  text = text.replace(/^###\s?(.*)$/gm, "<h3>$1</h3>");
  text = text.replace(/^##\s?(.*)$/gm, "<h2>$1</h2>");
  text = text.replace(/^#\s?(.*)$/gm, "<h1>$1</h1>");

  // --- 1. 太字の置換を先に ---
  // ***太字+大きい文字***
  text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="large-text">$1</strong>');
  // **太字**（通常サイズ）
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // __太字__（通常サイズ）
  text = text.replace(/__(.*?)__/g, "<strong>$1</strong>");
  // *斜体*や_斜体_はスルー

  // 水平線
  text = text.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, "<hr>");

  // --- 2. リストの置換 ---
  // 番号付きリスト
  text = text.replace(/^\d+\.\s?(.*)$/gm, "<li>$1</li>");
  // 箇条書きリスト
  text = text.replace(/^[-*+]\s?(.*)$/gm, "<li>$1</li>");
  // リストのグループ化
  text = text.replace(/(<li>.*?<\/li>)+/gs, function (match) {
    return match.match(/^\d+\./m) ? "<ol>" + match + "</ol>" : "<ul>" + match + "</ul>";
  });

  // インラインコード
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  // コードブロック
  text = text.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  // 引用
  text = text.replace(/^>\s?(.*)$/gm, "<blockquote>$1</blockquote>");

  // チェックリスト
  text = text.replace(/\[ \] (.*)/g, '<input type="checkbox" disabled> $1');
  text = text.replace(/\[x\] (.*)/gi, '<input type="checkbox" checked disabled> $1');

  // リンク
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  // 画像
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // テーブル（最小限）
  text = text.replace(/((\|.+\|[\r\n]+)+)/g, function (table) {
    const rows = table.trim().split('\n');
    let html = '<table>';
    rows.forEach((row, i) => {
      const cells = row.split('|').filter(Boolean);
      html += i === 0 ? '<tr>' + cells.map(c => `<th>${c.trim()}</th>`).join('') + '</tr>'
                      : '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
    });
    html += '</table>';
    return html;
  });

  // --- 改行は「通常テキスト行だけ<br>」に限定 ---
  // <br>化処理の前に「プレーンなテキスト行」を<p>で囲む
  text = text.split('\n').map(line => {
    // ブロック要素や空行はpでラップしない
    if (
      /^\s*<\s*\/?(h[1-6]|ul|ol|li|pre|table|tr|td|th|blockquote|hr|code|img|a|input|a)[ >]/i.test(line) ||
      /^\s*$/.test(line)
    ) {
      return line;
    }
    // 通常テキストは<p>で包む
    return `<p>${line.trim()}</p>`;
  }).join('');

  return text;
}
