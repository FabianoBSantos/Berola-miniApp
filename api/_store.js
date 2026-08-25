const { put, list, get } = require('@vercel/blob');

const PATHNAME = 'berola-catalog.json';

async function readCatalog() {
  try {
    const { blobs } = await list({ prefix: PATHNAME, limit: 1 });
    if (!blobs.length) return { prices: {}, stock: {} };
    const result = await get(blobs[0].url, { access: 'private' });
    if (!result || !result.stream) return { prices: {}, stock: {} };
    const text = await new Response(result.stream).text();
    const data = JSON.parse(text);
    return { prices: data.prices || {}, stock: data.stock || {} };
  } catch (e) {
    return { prices: {}, stock: {} };
  }
}

async function writeCatalog(data) {
  await put(PATHNAME, JSON.stringify(data), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  });
}

module.exports = { readCatalog, writeCatalog };
