const { query } = require('../db');
const { User } = require('../../models');
const { createCart } = require('./orderQueries');
const {
  dynamicUpdateString,
} = require('../../utils');

function resultsToUserObject(results) {
  // Get Results from query
  const {
    id, username, email, password, admin, created, updated,
  } = results.rows[0];

  // Create an user
  const resultUser = new User();
  resultUser.dataToGet(id, username, email, password, admin, created, updated);

  return resultUser;
}

function resultsToUserObjects(results) {
  const resultUsers = [];

  // Iterate through query results
  for (let i = 0; i < results.rows.length; i += 1) {
    const {
      id, username, email, password, admin, created, updated,
    } = results.rows[i];
    // Create an user
    const resultUser = new User();
    resultUser.dataToGet(id, username, email, password, admin, created, updated);

    resultUsers.push(resultUser);
  }
  return resultUsers;
}

async function insertUser(user) {
  // búum til userinn
  const sql = `INSERT INTO ecommerce.user 
                (username, email, password, admin)
              VALUES
                ($1, $2, $3, $4) RETURNING *`;
  const results = await query(
    sql, [user.username, user.email, await user.hashedPassword(), user.admin],
  );
  // búum til tóma körfu fyrir userinn
  await createCart(results.rows[0].id);

  console.info('User added to database');

  return resultsToUserObject(results);
}

async function updateUserById(id, fields, values) {
  const sql = dynamicUpdateString('ecommerce.user', fields, 'id');
  const results = await query(sql, values);

  console.info(`User ${id} updated`);
  const resultObject = await resultsToUserObject(results);
  return resultObject;
}

async function changeAdminStatus(id) {
  const sql = 'UPDATE ecommerce.user SET admin = NOT admin WHERE id=$1 RETURNING *';
  const results = await query(sql, [id]);
  console.info(`Admin status changed of user ${id}`);

  return resultsToUserObject(results);
}

async function getAllUsers(pageQuery = 0) {
  const page = 10 * pageQuery;
  const sql = 'SELECT * FROM ecommerce.user OFFSET $1 LIMIT 10';
  const results = await query(sql, [page]);
  return resultsToUserObjects(results);
}

async function getUserById(id) {
  const sql = 'SELECT * FROM ecommerce.user WHERE id=$1';
  const results = await query(sql, [id]);
  return resultsToUserObject(results);
}

async function getUserByUsername(username) {
  const sql = 'SELECT * FROM ecommerce.user WHERE username=$1';
  const results = await query(sql, [username]);
  return resultsToUserObject(results);
}

module.exports = {
  insertUser,
  updateUserById,
  changeAdminStatus,
  getAllUsers,
  getUserById,
  getUserByUsername,
};
