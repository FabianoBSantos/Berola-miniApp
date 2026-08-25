const { put, list } = require('@vercel/blob');

const PATHNAME = 'berola-catalog.json';

async function readCatalog() {
  try {
    const { blobs } = await list({ prefix: PATHNAME, limit: 1 });
    if (!blobs.length) return { prices: {}, stock: {} };
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) return { prices: {}, stock: {} };
    const data = await res.json();
    return { prices: data.prices || {}, stock: data.stock || {} };
  } catch (e) {
    return { prices: {}, stock: {} };
  }
}

async function writeCatalog(data) {
  await put(PATHNAME, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  });
}

module.exports = { readCatalog, writeCatalog };
