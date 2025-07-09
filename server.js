require('dotenv').config();

// 既存 require群の下あたりに追加
const { encoding_for_model } = require('@dqbd/tiktoken');
const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const path         = require('path');
const axios        = require('axios');
const crypto       = require('crypto');
const { Client }   = require('@notionhq/client');
const nodemailer   = require('nodemailer'); // 追加
const fs = require('fs');
const app    = express();


// ── 共通ミドルウェア ─────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// ---クッキーをセットする隠しURLルート---
app.get('/bypass-maintenance', (req, res) => {
  res.cookie('maintenance_bypass', 'true');
  res.send('Maintenance bypass enabled! 通常ページをリロードしてください。');
});


// 外部ファイル読み込み
const userMailTemplate = require('./mail-templates/user-complete.js');
const adminMailTemplate = require('./mail-templates/admin-notify.js');
const getJpDateStringJST = require('./japan-date.js');  //日本時刻へ変換

const {
  DEEPSEEK_API_URL,
  DEEPSEEK_API_KEY,
  NOTION_API_KEY,
  NOTION_DATABASE_ID,
  NOTION_LOG_DATABASE_ID,
  UNIVAPAY_WEBHOOK_SECRET,
  PORT = 3000,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  ADMIN_EMAIL
} = process.env;


const notion = new Client({ auth: NOTION_API_KEY });

// メール送信設定（nodemailer）
const mailTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// メンテナンスモード
app.use((req, res, next) => {
  // maintenance_bypass クッキーでバイパス可能にする
  if (
    process.env.MAINTENANCE_MODE === 'true'
    && req.path !== '/maintenance.html'
    && req.cookies.maintenance_bypass !== 'true'
  ) {
    return res
      .status(503)
      .sendFile(path.join(__dirname, 'public', 'maintenance.html'));
  }
  next();
});



// ── ミドルウェア設定 ─────────────────────────────────
// 1) / ルートを login.html にリダイレクト
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// 2) 静的ファイル配信（index.html は返さない）
app.use(
  express.static(path.join(__dirname, 'public'), {
    index: false
  })
);



// ── 認証ミドルウェア ──────────────────────────────────
function ensureAuth(req, res, next) {
  const session = req.cookies.userSession;
  if (!session) return res.redirect('/login.html');
  try {
    req.user = JSON.parse(session);
    next();
  } catch {
    res.clearCookie('userSession', { path: '/' });
    return res.redirect('/login.html');
  }
}

function ensureBasic(req, res, next) {
  if (req.user.plan !== 'Basic') return res.redirect('/login.html');
  next();
}

function ensurePro(req, res, next) {
  if (req.user.plan !== 'Pro') return res.redirect('/login.html');
  next();
}

// ── ログアウト ─────────────────────────────────────────
app.get('/logout', ensureAuth, (req, res) => {
  res.clearCookie('userSession', { path: '/' });
  res.redirect('/login.html');
});

// ── 認証前の公開ルート ─────────────────────────────────
app.get('/error.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/error.html'));
});
app.get('/unsubscribed.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/unsubscribed.html'));
});

// ── ログイン画面と認証処理 ─────────────────────────────
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/api/login', async (req, res) => {
  const { email } = req.body;
  try {
    const dbRes = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: 'Email',
        rich_text: { equals: email.trim().toLowerCase() }
      }
    });

    if (!dbRes.results.length) {
      return res.redirect('/unsubscribed.html');
    }

    const page = dbRes.results[0];
    // Notion ページIDとプロパティを取得
    const notionPageId = page.id;
    const id     = page.properties.ID.title[0]?.plain_text      || '';
    const name   = page.properties.Name.rich_text[0]?.plain_text || '';
    const plan   = page.properties.Plan.rich_text[0]?.plain_text || '';
    const status = page.properties.Status.rich_text[0]?.plain_text || '';
    
    // 退会済み判定
    if (plan === 'Unsubscribed' || status === '退会済') {
      return res.redirect('/unsubscribed.html');
    }
    
    // セッションに保存
    res.cookie(
      'userSession',
      JSON.stringify({ notionPageId, id, name, email, plan, status }),
      { maxAge: 24 * 60 * 60 * 1000, path: '/' }
    );

    // プラン別ページへリダイレクト
    return plan === 'Pro'
      ? res.redirect('/index.html')
      : res.redirect('/basic.html');

  } catch (err) {
    console.error('ログイン時 Notion 照合エラー:', err);
    return res.status(500).send('サーバーエラーが発生しました。');
  }
});

// ── 認証後、共通のページ ─────────────────────────────────
[
  'grade.html',
  'mypage.html',
  'action-plan.html',
  'goal-setting.html',
  'pre-survey.html',
  'persona.html',
  'concept-design.html'
].forEach(page => {
  app.get(`/${page}`, ensureAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', page));
  });
});

// ── Basicユーザー専用ページ ────────────────────────────
app.get('/basic.html', ensureAuth, ensureBasic, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/basic.html'));
});

// ── Proユーザー専用ページ ─────────────────────────────
[
  'appointment-copy.html',
  'catchphrase.html',
  'seminar-post.html',
  'seminar-structure.html',
  'seminar-title.html',
  'step-mail.html',
  'feed-post.html',
  'free-content.html',
  'sns-seminar-post.html'
].forEach(page => {
  app.get(`/${page}`, ensureAuth, ensurePro, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', page));
  });
});

// ── 退会申請用エンドポイント ─────────────────────────────
app.post('/api/unsubscribe', ensureAuth, async (req, res) => {
  const { notionPageId } = req.user;
  if (!notionPageId) {
    return res.status(400).json({ error: 'セッションに notionPageId がありません' });
  }
  try {
    await notion.pages.update({
      page_id: notionPageId,
      properties: {
        Plan: {
          rich_text: [
            { text: { content: 'Pro' } }
          ]
        },
        Status: {
          rich_text: [
            { text: { content: '退会申請済' } }
          ]
        },
        Unsubscribed_Date: {
          rich_text: [
            { text: { content: new Date().toISOString() } }
          ]
        }
      }
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Unsubscribe Error:', err);
    return res.status(500).json({ error: 'Notion 更新中にエラーが発生しました' });
  }
});

// ── DeepSeek API proxy───────────────────
app.post('/api/deepseek', ensureAuth, async (req, res) => {
  const { message, feature } = req.body;

  // 機能ごとにモデル＆トークン制限を切り替え
  let model = "deepseek-chat";
  let maxContext = 32000;
  let maxTokensLimit = 8192; // chatモデルの最大出力
//  if (feature === "lp-session" || feature === "seminar-structure") {
  if (feature === "lp-session") {
    model = "deepseek-reasoner";
    maxContext = 64000;
    maxTokensLimit = 64000; // reasonerモデルの最大出力
  }

  try {
    // トークン数をカウント
    const enc = encoding_for_model('gpt-3.5-turbo');
    const promptTokenCount = enc.encode(message).length;

    // max_tokensをモデルごと上限内に自動調整
    let max_tokens = maxContext - promptTokenCount - 1000;
    if (max_tokens > maxTokensLimit) max_tokens = maxTokensLimit;
    if (max_tokens < 1000) max_tokens = 1000;

    console.log(`[DeepSeek] feature:${feature} モデル:${model} 入力トークン:${promptTokenCount}／max_tokens:${max_tokens}`);

    // DeepSeek APIに送信
    const apiRes = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: model,
        messages: [{ role: 'user', content: message }],
        max_tokens: max_tokens
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    );
    const output = apiRes.data.choices[0].message.content;

    return res.json({ reply: output });
  } catch (err) {
    console.error('DeepSeek API error:', err.response?.data || err.message);
    return res.status(500).json({ error: err.response?.data || err.message });
  }
});




// ── LLM送受信内容をNotion「利用情報データベース」に保存するAPI ─────────────
app.post('/api/log-to-notion', ensureAuth, async (req, res) => {
  const { feature, input, output } = req.body;
  try {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_USAGE_DATABASE_ID },
      properties: {
        Name:    { title: [{ text: { content: req.user.name } }] },
        Feature: { rich_text: [{ text: { content: feature        } }] },
        Input:   { rich_text: [{ text: { content: input          } }] },
        Output:  { rich_text: [{ text: { content: output.slice(0, 2000) } }] },
        TimeStamp: { date: { start: new Date().toISOString() } }
      }
    });
    res.json({ success: true });
  } catch (e) {
    console.error('Notion利用情報DB保存エラー:', e);
    res.status(500).json({ error: 'Notion利用情報DB保存エラー' });
  }
});


// ── 既存ユーザー追加ルーター ────────────────────────────
const userRoutes = require('./routes/add-users.js');
app.use('/api', userRoutes);

// ── UnivaPay Webhook 受信用エンドポイント ─────────────────
app.post('/univapay-webhook', express.json(), (req, res) => {
  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${UNIVAPAY_WEBHOOK_SECRET}`) {
    console.warn('Invalid webhook auth:', auth);
    return res.sendStatus(401);
  }

  const event = req.body;
  console.log('UnivaPay Webhook received:', event.type);

  if (event.type === 'subscription_created' || event.type === 'subscription_payment') {
    const data = event.data;
    const meta = data.metadata || {};
    const info = data.billing_info || {};
    const name  = meta.customerName  || info.fullName      || 'Unknown';
    const email = meta.email         || info.emailAddress || '';
    const phone = meta.phone         || info.phoneNumber  || '';
    const productName = meta.productName   || '';
    console.log(`→ name: ${name}, email: ${email}, phone: ${phone}`);
    console.log(`→ productName: ${productName}`);    
  }

  return res.sendStatus(200);
});

// ── 決済完了後の Notion 更新用エンドポイント ─────────────────
app.post('/api/subscription-complete', express.json(), async (req, res) => {
  console.log('==== subscription-complete エンドポイント到達 ====', req.body); // 追加
  fs.appendFileSync('debug-log.txt', `[API受信] ${new Date().toISOString()} body=${JSON.stringify(req.body)}\n`);
  const { email, name, plan, phone } = req.body; // phoneも受け取る
  const now = getJpDateStringJST();
  const status = plan === 'monthly'
    ? '継続中（月額プラン）'
    : '継続中（年間プラン）';
  try {
    console.log('==== Notion更新前 ====');
    // 既存レコード検索
    const dbRes = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: { property: 'Email', rich_text: { equals: email.trim().toLowerCase() } }
    });
    if (dbRes.results.length) {
      // 更新
      const pageId = dbRes.results[0].id;
      await notion.pages.update({
        page_id: pageId,
        properties: {
          Plan:             { rich_text: [{ text:{ content:'Pro' } }] },
          Status:           { rich_text: [{ text:{ content: status } }] },
          Application_Date: { rich_text: [{ text:{ content: now } }] }
        }
      });
    console.log('---- Notion pages.update完了 ----');
    // NotionのDB更新直後
    fs.appendFileSync('debug-log.txt', `[Notion更新完了] ${new Date().toISOString()}\n`);  
    } else {
      // 新規作成
      const id = crypto.randomBytes(4).toString('hex');
      await notion.pages.create({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          ID:               { title:     [{ text:{ content:id } }] },
          Name:             { rich_text: [{ text:{ content:name } }] },
          Email:            { rich_text: [{ text:{ content:email } }] },
          Plan:             { rich_text: [{ text:{ content:'Pro' } }] },
          Status:           { rich_text: [{ text:{ content: status } }] },
          Application_Date: { rich_text: [{ text:{ content: now } }] }
        }
      });
    }

    // ───── メール送信処理ここから ─────
    fs.appendFileSync('debug-log.txt', `[メール送信直前] ${new Date().toISOString()}\n`);
    try {
      // 1. 購入者向け
      console.log('メール送信前: ', { email, name, plan, phone }); // 追加
      const userMail = userMailTemplate({ name, email, plan, now });
      await mailTransporter.sendMail({
        from: `"株式会社OnLine" <${SMTP_USER}>`,
        to: email,
        subject: userMail.subject,
        text: userMail.text,
        html: userMail.html // HTMLメールにも対応
      });
      console.log('ユーザー向けメール送信成功:', email); // 追加

      // 2. 管理者向け
      const adminMail = adminMailTemplate({ name, email, phone: phone || '', plan, now });
      await mailTransporter.sendMail({
        from: `"AI支援システム 販売自動通知" <${SMTP_USER}>`,
        to: ADMIN_EMAIL,
        subject: adminMail.subject,
        text: adminMail.text
      });          
      console.log('管理者向けメール送信成功:', ADMIN_EMAIL); // 追加

    } catch (mailErr) {
      console.error('メール送信エラー:', mailErr);
      // メール送信失敗でもDB更新はOKにする
    }
    // ───── メール送信処理ここまで ─────

    //return res.json({ ok: true });
    return res.json({ ok: true, req: req.body, message: 'API実行済み！' });

    console.log('==== Notion更新後・メール送信前 ====');
    
  } catch (err) {
    console.error('==== Notion更新・メール送信try/catchでエラー ====', err);
    return res.status(500).json({ error: err.toString() });
  }
});

// ── 静的アセット配信（フォールバック） ─────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── サーバ起動 ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
