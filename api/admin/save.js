const { readCatalog, writeCatalog } = require('../_store');
const { isAuthenticated } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const { type, catId, slug, value } = req.body || {};

  try {
    const data = await readCatalog();

    if (type === 'stock') {
      if (!slug || typeof value !== 'number' || value < 0) {
        res.status(400).json({ error: 'invalid_stock' });
        return;
      }
      data.stock[slug] = Math.floor(value);
    } else if (type === 'price') {
      if (!catId || !value || typeof value !== 'object') {
        res.status(400).json({ error: 'invalid_price' });
        return;
      }
      data.prices[catId] = value;
    } else {
      res.status(400).json({ error: 'invalid_type' });
      return;
    }

    await writeCatalog(data);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'store_error', message: e.message });
  }
};
