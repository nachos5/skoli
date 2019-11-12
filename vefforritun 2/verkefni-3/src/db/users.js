const bcrypt = require('bcrypt');

const { initClient } = require('./db');
const { passwordHash } = require('../core/utils');

async function getAllUsers() {
  const client = await initClient();
  const statement = 'SELECT * FROM users ORDER BY id ASC';
  const results = await client.query(statement);
  try {
    const rows = await results.rows;
    return rows;
  } finally {
    await client.end();
  }
}

async function storeUser(values) {
  console.info(values);
  const tmpValues = values;
  // ef það vantar admin skilgreiningu
  if (tmpValues.length === 4) {
    tmpValues.push(false);
  }

  // höshum passwordstrenginn
  const hash = await passwordHash(tmpValues[3]);
  tmpValues[3] = hash;

  const client = await initClient();
  const statement = `INSERT INTO users 
                        (nafn, netfang, notendanafn, lykilord, admin)
                      VALUES
                        ($1, $2, $3, $4, $5)`;
  try {
    return await client.query(statement, tmpValues);
  } finally {
    await client.end();
  }
}

async function findByUsername(notendanafn) {
  const client = await initClient();
  const statement = 'SELECT * FROM users WHERE notendanafn = $1';
  const results = await client.query(statement, [notendanafn]);
  try {
    const rows = await results.rows[0];
    return rows;
  } finally {
    await client.end();
  }
}

async function findById(id) {
  const client = await initClient();
  const statement = 'SELECT * FROM users WHERE id = $1';
  const results = await client.query(statement, [id]);
  try {
    const rows = await results.rows[0];
    return rows;
  } finally {
    await client.end();
  }
}

async function changeAdminStatusQuery(userIDs) {
  if (userIDs.length === 0) return false;
  const client = await initClient();
  // þurfum að gera 'dynamically' hversu margir parametrar eru í strengnum
  const params = [];
  for (let i = 1; i <= userIDs.length; i += 1) {
    params.push(`$${i}`);
  }
  const statement = `UPDATE users SET admin = NOT admin WHERE id IN (${params.join(',')})`;
  try {
    return await client.query(statement, userIDs);
  } finally {
    await client.end();
  }
}

async function getAllAdmins() {
  const client = await initClient();
  const statement = 'SELECT id FROM users WHERE admin = True ORDER BY id ASC';
  const results = await client.query(statement);
  try {
    const rows = await results.rows;
    return rows;
  } finally {
    await client.end();
  }
}

/**
 * Athugar hvort að gefið lykilorð passi við hashkóða gefins notendanafns
 *
 * @param {string} username notendanafn
 * @param {string} password lykilorð
 */
async function comparePasswords(password, user) {
  const userInfo = await findById(user.id);
  const match = await bcrypt.compare(password, userInfo.lykilord);

  if (match) {
    return userInfo;
  }

  return null;
}

module.exports = {
  getAllUsers,
  storeUser,
  comparePasswords,
  findByUsername,
  findById,
  changeAdminStatusQuery,
  getAllAdmins,
};
