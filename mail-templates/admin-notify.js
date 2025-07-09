// mail-templates/admin-notify.js
module.exports = function({ name, email, phone, plan, now }) {
  return {
    subject: 'AI支援システムの新規申込がありました',
    text: `
【AI支援システム Pro版】の新規申込がありました。

━━━━━━━━━━━━━━━━━━━━━━
■申込情報
お名前　　　：${name}
メールアドレス：${email}
電話番号　　：${phone}
ご選択プラン ：${plan === 'monthly' ? '月額プラン（¥5,500/月）' : '年間プラン（¥55,000/年）'}
申込日時　　：${now}
━━━━━━━━━━━━━━━━━━━━━━

管理画面で申込状況を必ずご確認ください。
    `.trim()
  }
}
