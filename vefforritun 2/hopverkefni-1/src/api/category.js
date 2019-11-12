const { check } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const createError = require('http-errors');

// Local files
const categoryQueries = require('../db/queries/categoryQueries');
const models = require('../models');
const {
  filterOutNullValues,
  xssSanitize,
  errorMessages,
} = require('../utils');

let categoryNames = []; // To display categoryNames in error message

// Validation error messages
const errorMsg = {
  id: 'Id verður að vera heiltala sem er stærri en 0',
  page: 'Page verður að vera heiltala sem er stærri eða jafnt og 0',
  name: {
    msg: (nr) => {
      let err = '';
      if (nr === 1) {
        err = 'Nafn verður að vera strengur sem er 1 til 32 stafir';
      } else {
        const names = [];
        categoryNames.forEach(row => names.push(row.name));
        err = `Nafnið er nú þegar tekið, þessir flokkar eru nú þegar til: ${names}`;
      }
      return err;
    },
  },
};

// Validators
const validateCategory = [
  sanitize('id').trim(),
  check('id').isInt({ gt: 0 })
    .withMessage(errorMsg.id),
];

const validateCategoryGet = [
  sanitize('page').trim(),
  check('page').optional().isInt({ gt: -1 })
    .withMessage(errorMsg.page),
];

const validateCategoryPost = [
  sanitize('name').trim(),
  check('name').isLength({ min: 1, max: 32 })
    .withMessage(errorMsg.name.msg(1))
    .custom(async (inputName) => {
      categoryNames = await categoryQueries.getAllCategoriesNames();
      if (categoryNames.find(row => row.name === inputName)) return false;
      return true;
    })
    .withMessage(() => errorMsg.name.msg(2)),
];

/**
 * Get all categories
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function allCategories(req, res, next) { // eslint-disable-line
  const items = ['page'];
  const clean = xssSanitize(items, req.query);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Query all categories
  await categoryQueries.getAllCategories(clean.page)
    .then((categories) => { // eslint-disable-line
      if (categories.length <= 0) return next(createError(400, 'NoResults'));
      res.status(200).json(categories);
    }).catch(next);
}

/**
 * Get category by id
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function categoryById(req, res, next) { // eslint-disable-line
  const items = ['id'];
  const clean = xssSanitize(items, req.params);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Query category
  await categoryQueries.getCategoryById(clean.id)
    .then((category) => { // eslint-disable-line
      if (category.length <= 0) return next(createError(400, 'NoResults'));
      res.status(200).json(category);
    }).catch(next);
}

/**
 * Create a new category with required field,
 * (name)
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function createCategory(req, res, next) { // eslint-disable-line
  const items = ['name'];
  const clean = xssSanitize(items, req.body);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  const category = new models.Category();
  category.dataToInsert(clean.name);

  // Create a new category
  await categoryQueries.insertCategory(category)
    .then((resultCategory) => {
      res.status(200).json(resultCategory);
    }).catch(next);
}

/**
 * Update category by id with required field,
 * (name)
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function updateCategory(req, res, next) { // eslint-disable-line
  const items = ['id', 'name'];
  const clean = xssSanitize(items, req.params, req.body);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  const category = new models.Category();
  category.dataToInsert(
    clean.name,
  );

  // Fields and values for update query
  const { fields, values } = filterOutNullValues(category);
  values.push(clean.id);

  // No changes error
  if (fields.length <= 0) return next(createError(400, 'NoContent', { method: 'patch', field: 'name' }));

  // Update category - return new category
  await categoryQueries.updateCategoryById(clean.id, fields, values)
    .then((resultCategory) => {
      res.status(200).json(resultCategory);
    }).catch(next);
}

/**
 * Delete category by id
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function deleteCategory(req, res, next) { // eslint-disable-line
  const items = ['id'];
  const clean = xssSanitize(items, req.params);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Delete category - return nothing
  await categoryQueries.deleteCategoryById(clean.id)
    .then(() => {
      res.status(204).json();
    }).catch(next);
}

module.exports = {
  validateCategory,
  validateCategoryGet,
  validateCategoryPost,
  allCategories,
  categoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
