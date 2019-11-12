const { query } = require('../db');
const { Category } = require('../../models');
const {
  dynamicUpdateString,
  getResults,
} = require('../../utils');

function resultsToCategoryObject(results) {
  const {
    id, name, created, updated,
  } = results.rows[0];
  const resultCategory = new Category();
  resultCategory.dataToGet(id, name, created, updated);

  return resultCategory;
}

function resultsToCategoryObjects(results) {
  const resultCategories = [];

  for (let i = 0; i < results.rows.length; i += 1) {
    const {
      id, name, created, updated,
    } = results.rows[i];
    const resultCategory = new Category();
    resultCategory.dataToGet(id, name, created, updated);

    resultCategories.push(resultCategory);
  }

  return resultCategories;
}

async function getAllCategories(pageQuery = 0) {
  const page = 10 * pageQuery;
  console.info('page = ', page);
  const sql = 'SELECT * FROM ecommerce.category OFFSET $1 LIMIT 10';
  const results = await query(sql, [page]);
  return results.rows;
}

async function getCategoryById(id) {
  const sql = 'SELECT * FROM ecommerce.category WHERE id=$1';
  const results = await query(sql, [id]);
  return resultsToCategoryObject(results);
}

async function getAllCategoryId() {
  const sql = 'SELECT id FROM ecommerce.category';
  const results = await query(sql);
  return resultsToCategoryObjects(results);
}

async function getAllCategoriesNames() {
  const sql = 'SELECT name FROM ecommerce.category';
  const results = await query(sql);
  return getResults(results);
}

async function insertCategory(category) {
  const sql = 'INSERT INTO ecommerce.category (name) VALUES ($1) RETURNING *';
  const results = await query(sql, [category.name]);
  console.info('Category added to database');
  // TODO: admin á bara að fá results
  return resultsToCategoryObject(results);
}

async function updateCategoryById(id, fields, values) {
  const sql = dynamicUpdateString('ecommerce.category', fields, 'id');
  const results = await query(sql, values);

  if (results.rows.length !== 0) console.info(`Category ${id} updated`);
  return resultsToCategoryObject(results);
}

// TODO: bara admin
async function deleteCategoryById(id) {
  const sql = 'DELETE FROM ecommerce.category WHERE id=$1';
  const results = await query(sql, [id]);
  if (results.rowCount === 0) {
    return false;
  }
  return true;
}

module.exports = {
  getAllCategories,
  getAllCategoryId,
  getAllCategoriesNames,
  getCategoryById,
  insertCategory,
  updateCategoryById,
  deleteCategoryById,
};
