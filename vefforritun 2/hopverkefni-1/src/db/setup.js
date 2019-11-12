require('dotenv').config();

const fs = require('fs');
const util = require('util');
const faker = require('faker');

const { insertCategory } = require('./queries/categoryQueries');
const { insertProduct } = require('./queries/productQueries');
const { insertUser } = require('./queries/userQueries');
const { query } = require('./db');
const { Category, Product, User } = require('../models');
const media = require('../media');
const { getAllImages } = require('../utils');

const connectionString = process.env.DATABASE_URL;
const dbUser = process.env.DATABASE_USER;
const readFileAsync = util.promisify(fs.readFile);

async function main() {
  console.info(`Set upp gagnagrunn á ${connectionString}`);
  // droppum töflum ef nú þegar til
  await query('DROP SCHEMA IF EXISTS ecommerce CASCADE;');
  console.info('Skemanu eytt');
  await query(`CREATE SCHEMA ecommerce AUTHORIZATION ${dbUser};`);

  // búa til töflur út frá skema
  try {
    const createTables = await readFileAsync('./src/db/schema.sql');
    await query(createTables.toString('utf8'));
    console.info('Töflur búnar til');
  } catch (e) {
    console.error('Villa við að búa til töflur:', e.message);
    return;
  }

  // uploadum myndunum
  const images = await getAllImages();
  try {
    const response = await media.uploadImages(images);
    console.info(response);
  } catch (e) {
    console.error(e);
  }

  // búum til admin user
  let user = new User();
  user.dataToInsert('admin', 'admin@example.com', 'adminadmin', true);
  await insertUser(user);
  // búum til non-admin user
  user = new User();
  user.dataToInsert('pleb', 'pleb@example.com', 'plebpleb', false);
  await insertUser(user);

  // búum til ólík flokkanöfn
  const uniqueCategoryNames = [];
  const categoriesCount = 12;
  while (uniqueCategoryNames.length < categoriesCount) {
    const categoryName = faker.commerce.department();
    if (!uniqueCategoryNames.includes(categoryName)) {
      uniqueCategoryNames.push(categoryName);
    }
  }

  // geymum flokkana
  const categories = [];
  for (let i = 0; i < uniqueCategoryNames.length; i += 1) {
    const category = new Category();
    category.dataToInsert(uniqueCategoryNames[i]);
    const resultCategory = await insertCategory(category); // eslint-disable-line
    categories.push(resultCategory.id);
  }

  // búum til 1000 ólíkar vörur
  const uniqueProductNames = [];
  const prices = [];
  const descriptions = [];
  const productsCount = 1000;
  while (uniqueProductNames.length < productsCount) {
    const productName = faker.commerce.productName();
    if (!uniqueProductNames.includes(productName)) {
      uniqueProductNames.push(productName);
      prices.push(faker.commerce.price(100, 100000, 0));
      descriptions.push(faker.lorem.paragraphs());
    }
  }

  for (let i = 0; i < uniqueProductNames.length; i += 1) {
    const product = new Product();
    product.dataToInsert(
      uniqueProductNames[i],
      prices[i],
      descriptions[i],
      images[parseInt(Math.random() * images.length, 10)],
      categories[parseInt(Math.random() * categories.length, 10)],
    );
    await insertProduct( // eslint-disable-line
      product,
    );
  }
}

main().catch((err) => {
  console.error(connectionString);
  console.error(dbUser);
  console.error(err);
});
