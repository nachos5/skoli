const { initClient } = require('./db');

async function storeApplication(values) {
  const client = await initClient();
  const statement = `
                    INSERT INTO 
                      applications (nafn, netfang, sími, texti, starf, unnin) 
                    VALUES
                      ($1, $2, $3, $4, $5, False)
                      `;
  try {
    return await client.query(statement, values);
  } finally {
    await client.end();
  }
}

async function getAllApplications() {
  const client = await initClient();
  const statement = 'SELECT * FROM applications ORDER BY id DESC';
  const results = await client.query(statement);
  try {
    const rows = await results.rows;
    return rows;
  } finally {
    await client.end();
  }
}

async function vinnaUmsokn(appId) {
  const client = await initClient();
  const statement = `
                    UPDATE 
                      applications 
                    SET 
                      unnin=True, unnin_dagsetning=current_timestamp 
                    WHERE
                      id=$1
                    `;
  try {
    return await client.query(statement, [appId]);
  } finally {
    await client.end();
  }
}

async function deleteApplication(appId) {
  const client = await initClient();
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
