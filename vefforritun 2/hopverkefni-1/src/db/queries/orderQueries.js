const { query } = require('../db');
const { totalPrice } = require('../../orderUtils');
const {
  dynamicUpdateString,
  getResults,
} = require('../../utils');

async function createCart(userid) {
  const sql = 'INSERT INTO ecommerce.order (userid) VALUES ($1) RETURNING *';
  const results = await query(sql, [userid]);
  return getResults(results);
}

async function getCart(userid) {
  const sql = 'SELECT * FROM ecommerce.order WHERE cart=TRUE AND userid=$1';
  const results = await query(sql, [userid]);
  return getResults(results);
}

async function getOrderline(lineId) {
  const sql = 'SELECT * FROM ecommerce.orderline WHERE id=$1';
  const results = await query(sql, [lineId]);
  return getResults(results);
}

async function getOrderlines(id) {
  const sql = 'SELECT * FROM ecommerce.orderline WHERE orderid = $1';
  const results = await query(sql, [id]);
  return results.rows;
}

async function getCartlines(userId) {
  const cartResults = await getCart(userId);
  const sql = 'SELECT * FROM ecommerce.orderline WHERE orderid = $1 ORDER BY created';
  const cartlineResults = await query(sql, [cartResults.id]);
  return cartlineResults.rows;
}

async function getAllInCart(userId) {
  const cart = await getCart(userId);
  const cartlines = await getCartlines(userId);
  cart.cartlines = cartlines;
  if (cartlines) {
    const total = await totalPrice(cartlines);
    cart.total = `${total} kr.`;
  }
  return cart;
}

async function insertCartline(cartid, orderline) {
  const { productid } = orderline;
  let { quantity } = orderline;
  if (!quantity) quantity = 1; // default
  const sql = 'INSERT INTO ecommerce.orderline (orderid, productid, quantity) VALUES ($1,$2,$3) RETURNING *';
  const results = await query(sql, [cartid, productid, quantity]);
  return getResults(results);
}

async function updateQuantity(orderlineid, quantity) {
  const sql = 'UPDATE ecommerce.orderline SET quantity=$2 WHERE id=$1 RETURNING *;';
  const results = await query(sql, [orderlineid, quantity]);
  return getResults(results);
}

async function deleteOrderline(id) {
  const sql = 'DELETE FROM ecommerce.orderline WHERE id=$1';
  const results = await query(sql, [id]);
  if (results.rowCount === 0) {
    return false;
  }
  return true;
}

// allar pantanir ef admin
async function getAllOrders(userId = null) {
  let sql = 'SELECT * FROM ecommerce.order WHERE cart=FALSE';
  const values = [];
  // ef ekki admin
  if (userId) {
    sql += ' AND userid = $1';
    values.push(userId);
  }
  sql += ' ORDER BY created DESC';
  const results = await query(sql, values);
  return results.rows;
}

async function getOrderById(id) {
  const sql = 'SELECT * FROM ecommerce.order WHERE cart=FALSE AND id=$1';
  const results = await query(sql, [id]);
  return getResults(results);
}

async function getAllInOrder(id) {
  const results = await getOrderById(id);
  const orderlines = await getOrderlines(id);
  const total = await totalPrice(orderlines);

  results.orderlines = orderlines;
  results.total = `${total} kr.`;
  return results;
}

async function cartToOrder(userid, fields, values) {
  // sækjum körfuna
  const cart = await getCart(userid);
  // tékkum hvort það séu einhverjar línur í körfunni
  const cartlines = await getCartlines(userid);
  if (cartlines.rowCount === 0) {
    return [];
  }
  values.push(cart.id);
  // breytum henni í pöntun
  const sql = dynamicUpdateString('ecommerce.order', fields, 'id', true);
  const results = await query(sql, values);
  results.cartlines = cartlines;
  // búum til nýja tóma körfu fyrir notandann
  await createCart(userid);
  return results.rows;
}

module.exports = {
  createCart,
  getCart,
  getOrderline,
  getOrderlines,
  getCartlines,
  getAllInCart,
  insertCartline,
  updateQuantity,
  deleteOrderline,
  getAllOrders,
  getOrderById,
  getAllInOrder,
  cartToOrder,
};
