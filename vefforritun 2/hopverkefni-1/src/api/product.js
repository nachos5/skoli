const { check } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const createError = require('http-errors');

// Local files
const categoryQueries = require('../db/queries/categoryQueries');
const productQueries = require('../db/queries/productQueries');
const models = require('../models');
const {
  filterOutNullValues,
  xssSanitize,
  errorMessages,
} = require('../utils');

// Column id in table ecommerce.category
let categoryIds = []; // To display categoryids in error message

// Validation error messages
const errorMsg = {
  category: 'Category query verður að vera heiltala sem er stærri en 0',
  page: 'Page verður að vera heiltala sem er stærri eða jafnt og 0',
  id: 'Id verður að vera heiltala sem er stærri en 0',
  name: [
    'Titill verður að vera strengur sem er 1 til 32 stafir',
    'Nafn er nú þegar tekinn, vinsamlegast veljið annað nafn',
  ],
  price: 'Verð verður að vera heiltala stærri eða jöfn 0',
  description: 'Vörulýsingar er krafist',
  image: 'Mynd verður að vera tengill',
  categoryid: {
    msg: (nr) => {
      let err = '';
      if (nr === 1) {
        err = 'Vöruflokksgildi verður að vera heiltala stærri en 0';
      } else {
        const ids = [];
        categoryIds.forEach(row => ids.push(row.id));
        err = `Vöruflokksgildi verður að vera einn af eftirfarandi vöruflokkum ${ids}`;
      }
      return err;
    },
  },
};

// Validators
const validateProductGet = [
  sanitize('category').trim(),
  check('category').optional().isInt({ gt: 0 })
    .withMessage(errorMsg.category),
  sanitize('page').trim(),
  check('page').optional().isInt({ gt: -1 })
    .withMessage(errorMsg.page),
];

const validateProductGetId = [
  sanitize('id').trim(),
  check('id').isInt({ gt: 0 })
    .withMessage(errorMsg.id),
  sanitize('category').trim(),
  check('category').optional().isInt({ gt: 0 })
    .withMessage(errorMsg.category),
];

const validateProductPost = [
  sanitize('name').trim(),
  check('name').isLength({ min: 1, max: 32 })
    .withMessage(errorMsg.name[0])
    .custom(async (name) => { // eslint-disable-line
      return productQueries.getProductByName(name)
        .then((product) => {
          if (product.name === name) return false;
          return true;
        }).catch((err) => {
          console.error('Query error: ', err);
        });
    })
    .withMessage(errorMsg.name[1]),

  sanitize('price').trim(),
  check('price').isInt({ gt: -1 })
    .withMessage(errorMsg.price),

  sanitize('description').trim(),
  check('description').isLength({ min: 1 })
    .withMessage(errorMsg.description),

  sanitize('image').trim(),
  check('image').optional().isURL()
    .withMessage(errorMsg.image),

  sanitize('categoryid').trim(),
  check('categoryid').isInt({ gt: 0 })
    .withMessage(errorMsg.categoryid.msg(1))
    .custom(async (inputId) => {
      categoryIds = await categoryQueries.getAllCategoryId();
      if (categoryIds.find(row => row.id == inputId)) return true; // eslint-disable-line
      return false;
    })
    .withMessage(() => errorMsg.categoryid.msg(2)),
];

const validateProductPatch = [
  sanitize('name').trim(),
  check('name').optional().isLength({ min: 1, max: 32 })
    .withMessage(errorMsg.name[0])
    .custom(async (name) => { // eslint-disable-line
      return productQueries.getProductByName(name)
        .then((product) => {
          if (product.name === name) return false;
          return true;
        }).catch((err) => {
          console.error('Query error: ', err);
        });
    })
    .withMessage(errorMsg.name[1]),

  sanitize('price').trim(),
  check('price').optional().isInt({ gt: -1 })
    .withMessage(errorMsg.price),

  sanitize('description').trim(),
  check('description').optional().isLength({ min: 1 })
    .withMessage(errorMsg.description),

  sanitize('image').trim(),
  check('image').optional().isURL()
    .withMessage(errorMsg.image),

  sanitize('categoryid').trim(),
  check('categoryid').optional().isInt({ gt: 0 })
    .withMessage(errorMsg.categoryid)
    .custom(async (inputId) => {
      categoryIds = await categoryQueries.getAllCategoryId();
      if (categoryIds.find(row => row.id == inputId)) return true; // eslint-disable-line
      return false;
    })
    .withMessage(() => errorMsg.categoryid.msg(2)),
];

/**
 * Get all products
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function allProducts(req, res, next) { // eslint-disable-line
  const items = ['category', 'search', 'page'];
  const clean = xssSanitize(items, req.query);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Query all products
  await productQueries.getAllProducts(clean.category, clean.search, clean.page)
    .then((products) => { // eslint-disable-line
      if (products.length <= 0) return next(createError(400, 'NoResults'));
      res.status(200).json(products);
    }).catch(next);
}

async function productCount(req, res, next) { // eslint-disable-line
  const items = ['category', 'search'];
  const clean = xssSanitize(items, req.query);

  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);
  console.info(clean.search);
  await productQueries.getProductCount(clean.category, clean.search)
    .then((count) => {
      res.status(200).json(count);
    }).catch(next);
}

/**
 * Get product by id
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function productById(req, res, next) { // eslint-disable-line
  const items = ['id'];
  const clean = xssSanitize(items, req.params);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Query product
  await productQueries.getProductById(clean.id)
    .then((product) => { // eslint-disable-line
      if (product.length <= 0) return next(createError(400, 'NoResults'));
      res.status(200).json(product);
    }).catch(next);
}

/**
 * Create a new product with required fields,
 * (name, price, description, categoryid)
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function createProduct(req, res, next) { // eslint-disable-line
  const items = ['name', 'price', 'description', 'image', 'categoryid'];
  const clean = xssSanitize(items, req.body);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  const product = new models.Product();
  product.dataToInsert(
    clean.name,
    clean.price,
    clean.description,
    clean.image,
    clean.categoryid,
  );

  // Create a new product
  await productQueries.insertProduct(product)
    .then((resultProduct) => {
      res.status(200).json(resultProduct);
    }).catch(next);
}

/**
 * Update product by id with optional fields
 * (always requires at least one field)
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function updateProduct(req, res, next) { // eslint-disable-line
  const items = ['id', 'name', 'price', 'description', 'image', 'categoryid'];
  const clean = xssSanitize(items, req.params, req.body);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  const product = new models.Product();
  product.dataToInsert(
    clean.name,
    clean.price,
    clean.description,
    clean.image,
    clean.categoryid,
  );

  // Fields and values for update query
  const { fields, values } = filterOutNullValues(product);
  values.push(clean.id);

  // No changes error
  if (fields.length <= 0) return next(createError(400, 'NoContent', { method: 'patch', field: 'name, price, description, categoryid' }));

  // Update product - return new product
  await productQueries.updateProductById(clean.id, fields, values)
    .then((resultProduct) => {
      res.status(200).json(resultProduct);
    }).catch(next);
}

/**
 * Delete product by id
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function deleteProduct(req, res, next) { // eslint-disable-line
  const items = ['id'];
  const clean = xssSanitize(items, req.params);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Delete product - return nothing
  await productQueries.deleteProductById(clean.id)
    .then(() => {
      res.status(204).json();
    }).catch(next);
}

module.exports = {
  validateProductGet,
  validateProductGetId,
  validateProductPost,
  validateProductPatch,
  allProducts,
  productCount,
  productById,
  createProduct,
  updateProduct,
  deleteProduct,
};
