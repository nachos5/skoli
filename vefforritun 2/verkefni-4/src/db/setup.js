require('dotenv').config();

const fs = require('fs');
const util = require('util');

const { query } = require('./db');

const connectionString = process.env.DATABASE_URL;

const readFileAsync = util.promisify(fs.readFile);

async function main() {
  console.info(`Set upp gagnagrunn á ${connectionString}`);
  // droppum töflum ef nú þegar til
  await query('DROP TABLE IF EXISTS todos');
  console.info('Töflunni eytt');

  // búa til töflur út frá skema
  try {
    const createTable = await readFileAsync('./src/db/schema.sql');
    await query(createTable.toString('utf8'));
    console.info('Töflur búnar til');
  } catch (e) {
    console.error('Villa við að búa til töflur:', e.message);
    return;
  }

  // bæta færslum við töflur
  try {
    const insert = await readFileAsync('./src/db/insert.sql');
    await query(insert.toString('utf8'));
    console.info('Gögnum bætt við');
  } catch (e) {
    console.error('Villa við að bæta gögnum við:', e.message);
  }
}

main().catch((err) => {
  console.error(err);
});
