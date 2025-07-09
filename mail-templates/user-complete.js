// mail-templates/user-complete.js
module.exports = function({ name, email, plan, now }) {
  return {
    subject: '【AI支援システム】Pro版お申込み・決済完了のお知らせ',
    text: `
${name} 様

このたびは「AI支援システム Pro版」への
お申込み誠にありがとうございます。

決済が無事に完了しましたので
ご登録内容をお送りさせていただきます。

━━━━━━━━━━━━━━━━━━━━━━
【ご登録内容】
お名前　　　：${name}
メールアドレス：${email}
ご選択プラン ：${plan === 'monthly' ? '月額プラン（¥5,500/月）' : '年間プラン（¥55,000/年）'}
ご利用開始日 ：${now}
━━━━━━━━━━━━━━━━━━━━━━

■Pro版のご利用方法
1.ログイン画面からご登録メールアドレスでログインしてください。
2.Pro版機能がすぐにご利用いただけます。
3.ログイン画面をご使用のブラウザで「お気に入り」に保存をお願いします。

▼ログインページ
https://ai-support-system-beta2.glitch.me/login.html

■利用規約
https://jb-revo.com/contents/wp-content/uploads/2025/05/AI-support-system-terms-of-use.pdf

■FAQ（よくあるご質問）
https://jb-revo.com/contents/wp-content/uploads/2025/05/ASS_FAQ_20250521.pdf

■Facebookグループ
Pro版購入者へは限定のコミュニティへご招待させていただきます。
こちらのコミュニティでいつでも最新情報を受け取ることができます。
https://www.facebook.com/groups/ai.support.system/

■お問合せ
ご不明な点がございましたら、
FAQ（よくあるご質問）をよくご確認の上
下記サポートまでご連絡ください。
>>support@shiraishikeiji.com

今後とも「AI支援システム」を
どうぞよろしくお願いいたします。

―――――――――――――――――
株式会社OnLine
AI支援システム運営事務局
support@shiraishikeiji.com
―――――――――――――――――
    `.trim()
  }
}
