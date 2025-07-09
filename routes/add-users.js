// routes/add-users.js

const express = require('express');
const axios   = require('axios');
const router  = express.Router();

const {
  NOTION_API_KEY,
  NOTION_DATABASE_ID
} = process.env;

const headers = {
  'Authorization': `Bearer ${NOTION_API_KEY}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

router.post('/users', async (req, res) => {
  const { id, name, email, plan, status } = req.body;
  try {
    // 1. 既存レコードをEmailで検索
    const queryRes = await axios.post(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      { filter: { property: 'Email', email: { equals: email } } },
      { headers }
    );

    // 2. 上書き or 新規作成
    if (queryRes.data.results.length > 0) {
      const pageId = queryRes.data.results[0].id;
      await axios.patch(
        `https://api.notion.com/v1/pages/${pageId}`,
        {
          properties: {
            ID:    { title:    [{ text: { content: id } }] },
            Name:  { rich_text:[{ text: { content: name } }] },
            Email: { email:     email },
            Plan:  { rich_text:[{ text: { content: plan } }] },
            Status:{ rich_text:[{ text: { content: status } }] }
          }
        },
        { headers }
      );
    } else {
      await axios.post(
        'https://api.notion.com/v1/pages',
        {
          parent: { database_id: NOTION_DATABASE_ID },
          properties: {
            ID:    { title:    [{ text: { content: id } }] },
            Name:  { rich_text:[{ text: { content: name } }] },
            Email: { email:     email },
            Plan:  { rich_text:[{ text: { content: plan } }] },
            Status:{ rich_text:[{ text: { content: status } }] }
          }
        },
        { headers }
      );
    }

    res.json({ success: true });
  } catch (err) {
    // optional chaining を使わない形に変更
    const detail = err.response && err.response.data
      ? err.response.data
      : err.message;
    console.error('Notion 追加エラー:', detail);
    res.status(500).json({ error: 'Notion への追加に失敗しました' });
  }
});

module.exports = router;
