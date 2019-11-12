const { query } = require('../db');
const { Product } = require('../../models');
const { getImageUrl } = require('../../media');
const {
  dynamicUpdateString,
} = require('../../utils');

async function resultsToProductObject(results) {
  const {
    id, name, price, description, image, categoryid, created, updated,
  } = results.rows[0];

  const resultProduct = new Product();
  resultProduct.dataToGet(id, name, price, description,
    (image.length > 0) ? await getImageUrl(image) : null,
    categoryid, created, updated);

  return resultProduct;
}

async function resultsToProductObjects(results) {
  const resultProducts = [];

  for (let i = 0; i < results.rows.length; i += 1) {
    const {
      id, name, price, description, image, categoryid, created, updated,
    } = results.rows[i];

    const resultProduct = new Product();
    resultProduct.dataToGet(id, name, price, description,
      (image.length > 0) ? await getImageUrl(image) : null,
      categoryid, created, updated);

    resultProducts.push(resultProduct);
  }

  return resultProducts;
}

async function insertProduct(product) {
  const sql = `INSERT INTO 
                 ecommerce.product (name, price, description, image, categoryid) 
               VALUES 
                 ($1, $2, $3, $4, $5) RETURNING *`;

  const results = await query(sql, [product.name, product.price, product.description,
    product.image, product.categoryid]);

  console.info('Product added to database');
  return resultsToProductObject(results);
}

async function updateProductById(id, fields, values) {
  const sql = dynamicUpdateString('ecommerce.product', fields, 'id');
  const results = await query(sql, values);

  if (results.rows.length !== 0) console.info(`Product ${id} updated`);

  return resultsToProductObject(results);
}

async function deleteProductById(id) {
  const sql = 'DELETE FROM ecommerce.product WHERE id=$1';
  const results = await query(sql, [id]);
  if (results.rowCount === 0) {
    return false;
  }
  return true;
}

async function getAllProducts(categoryQuery = null, searchQuery = null, pageQuery = 0) {
  const page = 12 * pageQuery;
  let sql = 'SELECT * FROM ecommerce.product';
  let results;

  const append = 'ORDER BY created DESC OFFSET $1 LIMIT 12';
  // Query síun
  if (categoryQuery && searchQuery) {
    sql += ` WHERE categoryid = $2 AND (LOWER(name) LIKE LOWER($3) OR LOWER(description) LIKE LOWER($3)) ${append}`;
    results = await query(sql, [page, categoryQuery, `%${searchQuery}%`]);
  } else if (categoryQuery) {
    sql += ` WHERE categoryid = $2 ${append}`;
    results = await query(sql, [page, categoryQuery]);
  } else if (searchQuery) {
    sql += ` WHERE (LOWER(name) LIKE LOWER($2) OR LOWER(description) LIKE LOWER($2)) ${append}`;
    console.info(`'%${searchQuery}%'`);
    results = await query(sql, [page, `%${searchQuery}%`]);
  } else {
    sql += ` ${append}`;
    results = await query(sql, [page]);
  }

  console.info(sql);

  return resultsToProductObjects(results);
}

async function getProductCount(categoryQuery = null, searchQuery = null) {
  console.info(searchQuery);

  let sql = 'SELECT COUNT(*) FROM ecommerce.product';
  let results;
  if (categoryQuery && searchQuery) {
    sql += ' WHERE categoryid = $1 AND (LOWER(name) LIKE LOWER($2) OR LOWER(description) LIKE LOWER($2))';
    results = await query(sql, [categoryQuery, `%${searchQuery}%`]);
  } else if (categoryQuery) {
    sql += ' WHERE categoryid = $1';
    results = await query(sql, [categoryQuery]);
  } else if (searchQuery) {
    sql += ' WHERE (LOWER(name) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1))';
    console.info(sql);
    results = await query(sql, [`%${searchQuery}%`]);
  } else {
    results = await query(sql);
  }

  return results.rows[0];
}

async function getAllProductId() {
  const sql = 'SELECT id FROM ecommerce.product ORDER BY created DESC';
  const results = await query(sql);
  return results.rows;
}

async function getProductById(id) {
  const sql = 'SELECT * FROM ecommerce.product WHERE id=$1';
  const results = await query(sql, [id]);
  return resultsToProductObject(results);
}

async function getProductByName(name) {
  const sql = 'SELECT * FROM ecommerce.product WHERE name=$1';
  const results = await query(sql, [name]);
  return resultsToProductObject(results);
}

module.exports = {
  insertProduct,
  getAllProducts,
  getProductCount,
  getAllProductId,
  getProductById,
  getProductByName,
  updateProductById,
  deleteProductById,
};
