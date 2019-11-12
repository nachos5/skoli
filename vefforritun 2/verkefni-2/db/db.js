const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL; // sótt úr env gegnum dotenv pakka

// fall sem lætur okkur reyna að tengjast við postgres
async function init() {
  const client = new Client({ connectionString });
  await client.connect()
    .then(() => console.info('connected'))
    .catch(e => console.error('connection error', e.stack));
  return client;
}

async function storeApplication(values) {
  const client = await init();
  const statement = 'INSERT INTO applications (nafn, netfang, sími, texti, starf, unnin) VALUES($1, $2, $3, $4, $5, False)';
  try {
    return await client.query(statement, values);
  } finally {
    await client.end();
  }
}

async function getAllApplications() {
  const client = await init();
  const statement = 'SELECT * FROM applications ORDER BY dagsetning DESC';
  const results = await client.query(statement);
  try {
    return await results.rows;
  } finally {
    await client.end();
  }
}

async function vinnaUmsokn(appId) {
  const client = await init();
  const statement = 'UPDATE applications SET unnin=True, unnin_dagsetning=current_timestamp WHERE id=$1';
  try {
    return await client.query(statement, [appId]);
  } finally {
    await client.end();
  }
}

async function deleteApplication(appId) {
  const client = await init();
  const statement = 'DELETE FROM applications WHERE id=$1';
  try {
    return await client.query(statement, [appId]);
  } finally {
    await client.end();
  }
}

module.exports = {
  getAllApplications,
  storeApplication,
  vinnaUmsokn,
  deleteApplication,
};
