// public/sidebar-loader.js 
console.log('[debug] sidebar-loader.js LOADED!');

;(async () => {
  try {
    const res  = await fetch('/sidebar.html');
    if (!res.ok) throw new Error('sidebar.htmlのfetchに失敗');
    const html = await res.text();
    document.getElementById('sidebar-container').innerHTML = html;
    console.log('[debug] sidebar.html FETCHED & INSERTED!');

    // === ここでa[data-cat]にhrefを付与 ===
    const kv = document.cookie
      .split('; ')
      .find(row => row.startsWith('userSession='));
    let plan = 'Basic';
    if (kv) {
      try {
        plan = JSON.parse(decodeURIComponent(kv.split('=')[1])).plan;
      } catch {}
    }
    document.querySelectorAll('.sidebar [data-cat]').forEach(a => {
      const cat = a.getAttribute('data-cat');
      const base = (plan === 'Pro') ? '/index.html' : '/basic.html';
      a.href = `${base}?category=${encodeURIComponent(cat)}`;
    });

    // サイドバーのカテゴリフィルタをmain-form.jsから呼び出す
    import('/js/main-form.js')
      .then(mod => {
        console.log('[debug] main-form.js loaded!', mod);
        if (mod.setupSidebarFilter) {
          console.log('[debug] calling setupSidebarFilter()');
          mod.setupSidebarFilter();
        } else {
          console.warn('[debug] setupSidebarFilter not found!');
        }
      })
      .catch(e => {
        console.error('[debug] main-form.js import FAILED!', e);
      });

    // ── 戻るボタン (id="return-home") のリンクを書き換え ──
    const returnBtn = document.getElementById('return-home');
    if (returnBtn) {
      returnBtn.href = plan === 'Pro' ? '/index.html' : '/basic.html';
    }

    // ── サイドバー内の「トップページ」リンクを書き換え ────
    const topLink = document.querySelector('.sidebar a.sidebar-link[href="/index.html"]');
    if (topLink) {
      topLink.href = plan === 'Pro' ? '/index.html' : '/basic.html';
    }

  } catch (e) {
    console.error('sidebar-loader エラー:', e);
  }
})();
