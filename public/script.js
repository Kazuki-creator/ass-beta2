// public/js/script.js

document.addEventListener('DOMContentLoaded', () => {
  // ─ セッション切れ検知 ─
  try {
    ensureSession();
  } catch {
    // 切れていれば以降の初期化は行わない
    return;
  }

  // 全機能アイテムを取得
  const functionItems = document.querySelectorAll('.items-container .item');

  // 1) URLクエリパラメータ ?category=xxx から初期フィルタリング
  const params   = new URLSearchParams(window.location.search);
  const category = params.get('category');
  if (category) {
    functionItems.forEach(item => {
      // data-category 属性が一致するものだけ表示、それ以外は非表示
      if (item.dataset.category === category) {
        item.style.display = 'flex';    // flex レイアウトを維持
      } else {
        item.style.display = 'none';
      }
    });
  }

  // 2) ページ内にある .filter-item ボタンを使った動的フィルタリング（あれば）
  const filterItems = document.querySelectorAll('.filter-item');
  filterItems.forEach(filter => {
    filter.addEventListener('click', () => {
      const cat = filter.dataset.category;
      console.log('Filter clicked:', cat);
      functionItems.forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 3) β版機能ボタンをクリックしたらポップアップ表示
  document.querySelectorAll('.items-container .item.beta').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      alert('今後リリース予定の機能です。実装をお楽しみに！');
    });
  });
});
