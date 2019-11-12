const { check } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const createError = require('http-errors');
const xss = require('xss');

// Local files
const userQueries = require('../db/queries/userQueries');
const models = require('../models');
const {
  filterOutNullValues,
  xssSanitize,
  readFileJSON,
  errorMessages,
} = require('../utils');
// List of top 500 passwords
const top500pwPath = 'src/misc/top500pw.json';

// Validation error messages
const errorMsg = {
  id: 'Id verður að vera heiltala sem er stærri en 0',
  page: 'Page verður að vera heiltala sem er stærri eða jafnt og 0',
  email: [
    'Netfang verður að vera gilt netfang',
    'Netfangið verður að vera lengra en 1 stafur',
  ],
  password: [
    'Lykilorðið verður að vera að minnsta kosti 8 stafir',
    'Lykilorð má ekki vera á lista yfir algeng lykilorð',
  ],
};

// Validators
const validateUserGet = [
  sanitize('page').trim(),
  check('page').optional().isInt({ gt: -1 })
    .withMessage(errorMsg.page),
];

const validateUserParam = [
  sanitize('id').trim(),
  check('id').isInt({ gt: 0 })
    .withMessage(errorMsg.id),
];

const validateUserUpdate = [
  sanitize('email').trim(),
  check('email').optional()
    .isEmail().withMessage(errorMsg.email[0])
    .isLength({ min: 1 })
    .withMessage(errorMsg.email[1]),

  sanitize('password').trim(),
  check('password').optional()
    .isLength({ min: 8 }).withMessage(errorMsg.password[0])
    .custom((password) => { // eslint-disable-line
      return readFileJSON(top500pwPath)
        .then((pwlist) => {
          if (pwlist.find(pw => pw === password)) return false;
          return true;
        }).catch((err) => {
          console.error('Read file error: ', err);
        });
    })
    .withMessage(errorMsg.password[1]),
];

/**
 * Get all users - Login: Admin
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function allUsers(req, res, next) { // eslint-disable-line
  const items = ['page'];
  const clean = xssSanitize(items, req.query);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Query all users
  await userQueries.getAllUsers(clean.page)
    .then((users) => { // eslint-disable-line
      if (users.length <= 0) return next(createError(400, 'NoResults'));
      res.status(200).json(users);
    }).catch(next);
}

/**
 * Get user by id - Login: Admin
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function userById(req, res, next) { // eslint-disable-line
  const items = ['id'];
  const clean = xssSanitize(items, req.params);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Query user - return w/o password
  await userQueries.getUserById(clean.id)
    .then((user) => {
      const cleanUser = user;
      delete cleanUser.password;
      res.status(200).json(cleanUser);
    }).catch(next);
}

/**
 * Get my user - Login: user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function myUser(req, res, next) {
  const items = ['id'];
  const clean = xssSanitize(items, req.user);

  // Query user - return w/o password
  await userQueries.getUserById(clean.id)
    .then((user) => {
      const cleanUser = user;
      delete cleanUser.password;
      res.status(200).json(cleanUser);
    }).catch(next);
}

/**
 * Update my user - Login: user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function updateMyUser(req, res, next) { // eslint-disable-line
  const items = ['email', 'password'];
  const clean = xssSanitize(items, req.body);
  clean.id = xss(req.user.id);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // New user object
  const user = new models.User();
  user.dataToUpdate(clean.email, clean.password);

  // Fields and values for update query
  const { fields, values } = filterOutNullValues(user);
  values.push(clean.id);

  // No changes error
  if (fields.length === 0) return next(createError(400, 'NoContent', { method: 'patch', field: 'email, password' }));

  // Update user - return w/o password
  await userQueries.updateUserById(clean.id, fields, values)
    .then((resultUser) => {
      const cleanUser = resultUser;
      delete cleanUser.password;
      res.status(200).json(cleanUser);
    }).catch(next);
}

/**
 * Change admin status - Login: Admin, only other users
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function changeAdminStatus(req, res, next) { // eslint-disable-line
  const items = ['id'];
  const clean = xssSanitize(items, req.params);

  // Changes to your own admin status is forbidden
  const cleanMyId = xss(req.user.id);
  if (cleanMyId === clean.id) return next(createError.Forbidden());

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Change admin status
  await userQueries.changeAdminStatus(clean.id)
    .then((user) => {
      const cleanUser = user;
      delete cleanUser.password;
      res.status(200).json(cleanUser);
    }).catch(next);
}

module.exports = {
  validateUserParam,
  validateUserGet,
  validateUserUpdate,
  allUsers,
  userById,
  myUser,
  updateMyUser,
  changeAdminStatus,
};
