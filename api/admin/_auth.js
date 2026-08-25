const crypto = require('crypto');

function getCookie(req, name) {
  const raw = req.headers.cookie || '';
  const parts = raw.split(';').map(s => s.trim());
  for (const p of parts) {
    if (p.startsWith(name + '=')) return decodeURIComponent(p.slice(name.length + 1));
  }
  return null;
}

function isAuthenticated(req) {
  const SECRET = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!SECRET) return false;
  const cookieVal = getCookie(req, 'berola_admin');
  if (!cookieVal) return false;
  const idx = cookieVal.lastIndexOf('.');
  if (idx < 0) return false;
  const value = cookieVal.slice(0, idx);
  const sig = cookieVal.slice(idx + 1);
  const expected = crypto.createHmac('sha256', SECRET).update(value).digest('hex');
  try {
    return value === 'admin' && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch (e) {
    return false;
  }
}

module.exports = { isAuthenticated };
