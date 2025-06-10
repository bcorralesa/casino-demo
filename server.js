// server.js
import express from 'express';
import path from 'path';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

// Remove the “!”—this is JS, not TS
const SUBS_KEY  = process.env.VITE_SUBS_KEY;
const APIM_BASE = process.env.VITE_APIM_BASE;

// Optional guard:
if (!SUBS_KEY) {
  throw new Error('Missing VITE_SUBS_KEY env var');
}
if (!APIM_BASE) {
  throw new Error('Missing VITE_APIM_BASE env var');
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/verify-age', async (req, res) => {
  try {
    const resp = await fetch(`${APIM_BASE}/idv/idvpayload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': SUBS_KEY
      },
      body: JSON.stringify(req.body)
    });
    const body = await resp.json();
    res.status(resp.status).json(body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Proxy error' });
  }
});

app.get('/api/verify-age/:id', async (req, res) => {
  try {
    const resp = await fetch(`${APIM_BASE}/idv/idvpayload/${req.params.id}`, {
      headers: { 'Ocp-Apim-Subscription-Key': SUBS_KEY }
    });
    if (resp.status === 404) return res.sendStatus(404);
    const body = await resp.json();
    res.status(resp.status).json(body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Proxy error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
