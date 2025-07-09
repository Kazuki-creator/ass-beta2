/**
 * ログイン状態パトロール機能
 　指定したクッキー名の値を返す。なければ null。
 */
export function getCookie(name) {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * userSession がなければログイン画面へリダイレクトして処理を止める
 */
export function ensureSession() {
  if (!getCookie('userSession')) {
    alert('セッションの有効期限が切れています。再度ログインしてください。');
    window.location.href = '/login.html';
    throw new Error('Session expired');
  }
}
