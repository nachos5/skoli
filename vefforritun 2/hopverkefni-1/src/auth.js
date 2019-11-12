const express = require('express');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { check } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const createError = require('http-errors');

// Local files
const userQueries = require('./db/queries/userQueries');
const models = require('./models');
const { catchErrors, xssSanitize, errorMessages } = require('./utils');

const {
  JWT_SECRET: jwtSecret,
  JWT_TOKEN_LIFETIME,
} = process.env;

if (!jwtSecret) {
  console.error('add JWT_SECRET to .env');
  process.exit(1);
}

// default er vika, hægt að stilla í env
let tokenLifetime = 60 * 60 * 24 * 7; // 1 week
if (JWT_TOKEN_LIFETIME) tokenLifetime = JWT_TOKEN_LIFETIME;

const app = express();
app.use(express.json());

// jwt upplýsingar
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

/**
 * Passport strategy
 *
 * @param {Object} data - {id: 'id of user', iat: '', exp: 'expire date'}
 * @param {Object} next - Next route
 */
async function strat(data, next) {
  await userQueries.getUserById(data.id)
    .then((results) => {
      next(null, results);
    }).catch(next);
}

passport.use(new Strategy(jwtOptions, strat));

app.use(passport.initialize());

// Validation error messages
const errorMsg = {
  username: 'Notendanafn verður að vera strengur sem er 1 til 32 stafir',
  email: 'Netfangið verður að vera gilt',
  password: 'Vinsamlegast sláðu inn lykilorð sem er að minnsta kosti 8 stafir',
};

// Validators
const validateRegister = [
  sanitize('username').trim(),
  check('username').isLength({ min: 1, max: 32 })
    .withMessage(errorMsg.username),

  sanitize('email').trim(),
  check('email').isEmail()
    .withMessage(errorMsg.email),

  sanitize('password').trim(),
  check('password').isLength({ min: 8 })
    .withMessage(errorMsg.password),
];

const validateLogin = [
  sanitize('username').trim(),
  check('username').isLength({ min: 1, max: 32 })
    .withMessage(errorMsg.username),

  sanitize('password').trim(),
  check('password').isLength({ min: 8 })
    .withMessage(errorMsg.password),
];

/**
 * Admin authenticator middleware
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
function authAdmin(req, res, next) {
  if (req.user.admin) return next();
  return next(createError.Unauthorized());
}

/**
 * Login authenticator middleware
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
function authMiddleware(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user) => {
      if (err) return next(err); // Error from strategy
      if (!user) return next(createError.Unauthorized()); // Failed authentication

      req.user = user;
      return next(); // Successfull authentication, go to route
    },
  )(req, res, next);
}

/**
 * Register a new user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function register(req, res, next) { // eslint-disable-line
  const items = ['username', 'email', 'password'];
  const clean = xssSanitize(items, req.body);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  const user = new models.User();
  user.dataToInsert(clean.username, clean.email, clean.password);

  // Insert (register) a new user
  await userQueries.insertUser(user)
    .then((resultUser) => {
      const cleanUser = resultUser;
      delete cleanUser.password;
      res.status(200).json(cleanUser);
    }).catch(next);
}

/**
 * Login user with username and password
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function login(req, res, next) { // eslint-disable-line
  const items = ['username', 'password'];
  const clean = xssSanitize(items, req.body);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Login user
  await userQueries.getUserByUsername(clean.username)
    .then(async (user) => {
      // Compare passwords
      await user.comparePasswords(clean.password)
        .then((matched) => {
          if (!matched) throw createError.Unauthorized();
        });

      // Successfull login, send token
      const payload = { id: user.id };
      const tokenOptions = { expiresIn: tokenLifetime };
      const userToken = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);

      return res.status(200).json({
        admin: user.admin,
        username: user.username,
        email: user.email,
        token: userToken,
      });
    }).catch((err) => { // eslint-disable-line
      return res.status(401).json([
        {
          errors: ['Notandi eða lykilorð er ekki rétt'],
          field: 'all',
          location: 'body',
        },
      ]);
    });
}

app.post('/users/register', validateRegister, catchErrors(register));
app.post('/users/login', validateLogin, catchErrors(login));


module.exports = app;
module.exports.authMiddleware = authMiddleware;
module.exports.authAdmin = authAdmin;
