const crypto = require('crypto');

function sign(value, secret) {
  const h = crypto.createHmac('sha256', secret).update(value).digest('hex');
  return `${value}.${h}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const SECRET = process.env.ADMIN_SECRET || ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    res.status(500).json({ error: 'server_not_configured' });
    return;
  }

  const { password } = req.body || {};
  if (!password || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'wrong_password' });
    return;
  }

  const token = sign('admin', SECRET);
  const isProd = !!process.env.VERCEL;
  res.setHeader(
    'Set-Cookie',
    `berola_admin=${token}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Lax${isProd ? '; Secure' : ''}`
  );
  res.status(200).json({ ok: true });
};
