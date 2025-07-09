require('dotenv').config();

const nodemailer = require('nodemailer');
const adminMailTemplate = require('./mail-templates/admin-notify.js');

// --- テスト送信する宛先や内容をここで指定 ---
const testData = {
  name: '中村香月',
  email: 'kazuki.nakamura.5119@gmail.com',
  phone: '090-1234-5678',
  plan: 'yearly', // 'monthly' or 'yearly'
  now: new Date().toISOString().slice(0, 10)
};

// 管理者宛メールアドレス
const adminEmail = process.env.TEST_ADMIN_RECEIVER || process.env.ADMIN_EMAIL || 'admin@example.com';

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
const mail = adminMailTemplate(testData);

transporter.sendMail({
  from: `"AI支援システム自動通知" <${process.env.SMTP_USER}>`,
  to: adminEmail,
  subject: mail.subject,
  text: mail.text
}, (err, info) => {
  if (err) {
    console.error('送信エラー:', err);
  } else {
    console.log('送信成功:', info.response);
  }
});
