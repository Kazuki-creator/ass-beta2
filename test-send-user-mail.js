require('dotenv').config();

const nodemailer = require('nodemailer');
const userMailTemplate = require('./mail-templates/user-complete.js');

// --- テスト送信する宛先や内容をここで指定 ---
const testData = {
  name: '中村香月',
  email: process.env.TEST_RECEIVER || 'kazuki.nakamura.5119@gmail.com', // 環境変数か直書き
  plan: 'monthly', // 'monthly' or 'yearly'
  now: new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'
};

// メール送信設定
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// テンプレートから本文生成
const mail = userMailTemplate(testData);

transporter.sendMail({
  from: `"【株式会社OnLine】AI支援システム運営" <${process.env.SMTP_USER}>`,
  to: testData.email,
  subject: mail.subject,
  text: mail.text
}, (err, info) => {
  if (err) {
    console.error('送信エラー:', err);
  } else {
    console.log('送信成功:', info.response);
  }
});
