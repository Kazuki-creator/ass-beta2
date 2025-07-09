// test-mail.js
require('dotenv').config(); // .env使う場合

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.lolipop.jp',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // 465の場合true
  auth: {
    user: process.env.SMTP_USER || 'support@shiraishikeiji.com',
    pass: process.env.SMTP_PASS || 'ここにパスワード',
  },
});

const mailOptions = {
  from: `"株式会社OnLine" <${process.env.SMTP_USER || 'support@shiraishikeiji.com'}>`,
  to: 'ketumebaka05@gmail.com',  // 自分やGmailなど
  subject: '【テスト】ASS Pro版へのお申込が完了しました',
  text: `
これはテストメールです。

けつめぐまさん、こんにちは！日曜日のイカ釣り、行けそうです。
`,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('送信エラー:', error);
  }
  console.log('メール送信成功:', info.response);
});
