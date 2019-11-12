const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL; // sótt úr env gegnum dotenv pakka

async function query(q, values = []) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(q, values);

    return result;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

// fall sem lætur okkur reyna að tengjast við postgres
async function initClient() {
  const client = new Client({ connectionString });
  await client.connect()
    .then(() => console.info('connected'))
    .catch(e => console.error('connection error', e.stack));
  return client;
}

module.exports = {
  query,
  initClient,
};
