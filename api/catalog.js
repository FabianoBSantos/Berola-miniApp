const { readCatalog } = require('./_store');
const categories = require('../categories.json');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  const data = await readCatalog();
  res.setHeader('Cache-Control', 'no-store, must-revalidate');
  res.status(200).json({
    prices: data.prices,
    stock: data.stock,
    itemPrices: data.itemPrices,
    defaults: categories
  });
};
