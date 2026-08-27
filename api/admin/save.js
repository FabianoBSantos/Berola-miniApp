const { readCatalog, writeCatalog } = require('../_store');
const { isAuthenticated } = require('./_auth');
const items = require('../../items.json');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const { type, catId, slug, value, values } = req.body || {};

  try {
    const data = await readCatalog();
    data.prices = data.prices || {};
    data.stock = data.stock || {};
    data.itemPrices = data.itemPrices || {};

    if (type === 'stock') {
      if (!slug || typeof value !== 'number' || value < 0) {
        res.status(400).json({ error: 'invalid_stock' });
        return;
      }
      data.stock[slug] = Math.floor(value);

    } else if (type === 'bulk_stock') {
      if (!values || typeof values !== 'object') {
        res.status(400).json({ error: 'invalid_bulk_stock' });
        return;
      }
      for (const [s, v] of Object.entries(values)) {
        if (typeof v === 'number' && v >= 0) data.stock[s] = Math.floor(v);
      }

    } else if (type === 'price') {
      if (!catId || !value || typeof value !== 'object') {
        res.status(400).json({ error: 'invalid_price' });
        return;
      }
      data.prices[catId] = value;

    } else if (type === 'item_price') {
      if (!slug || !value || typeof value !== 'object') {
        res.status(400).json({ error: 'invalid_item_price' });
        return;
      }
      data.itemPrices[slug] = value;

    } else if (type === 'clear_item_price') {
      if (!slug) {
        res.status(400).json({ error: 'invalid_slug' });
        return;
      }
      delete data.itemPrices[slug];

    } else if (type === 'clear_category_item_prices') {
      if (!catId) {
        res.status(400).json({ error: 'invalid_cat' });
        return;
      }
      const slugsInCat = items.filter(it => it.catId === catId).map(it => it.slug);
      slugsInCat.forEach(s => { delete data.itemPrices[s]; });

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
