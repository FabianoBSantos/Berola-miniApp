module.exports = async function handler(req, res) {
  res.setHeader('Set-Cookie', 'berola_admin=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
  res.status(200).json({ ok: true });
};
