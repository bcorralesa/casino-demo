// server.js
const express = require('express');
const path    = require('path');

// Read env vars
const SUBS_KEY  = process.env.VITE_SUBS_KEY;
const APIM_BASE = process.env.VITE_APIM_BASE;

if (!SUBS_KEY || !APIM_BASE) {
  console.error("❌ Missing VITE_SUBS_KEY or VITE_APIM_BASE");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve React build
app.use(express.static(path.join(__dirname, 'dist')));

// POST proxy
app.post('/api/verify-age', async (req, res) => {
  try {
    // Node 20+ provides global fetch
    const resp = await fetch(`${APIM_BASE}/idv/idvpayload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': SUBS_KEY,
      },
      body: JSON.stringify(req.body),
    });
    const body = await resp.json();
    res.status(resp.status).json(body);
  } catch (err) {
    console.error("Proxy POST error:", err);
    res.status(500).json({ error: err.message || 'Proxy error' });
  }
});

// GET proxy (polling)
app.get('/api/verify-age/:id', async (req, res) => {
  try {
    const resp = await fetch(`${APIM_BASE}/idv/idvpayload/${req.params.id}`, {
      headers: { 'Ocp-Apim-Subscription-Key': SUBS_KEY }
    });
    if (resp.status === 404) return res.sendStatus(404);
    const body = await resp.json();
    res.status(resp.status).json(body);
  } catch (err) {
    console.error("Proxy GET error:", err);
    res.status(500).json({ error: err.message || 'Proxy error' });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
