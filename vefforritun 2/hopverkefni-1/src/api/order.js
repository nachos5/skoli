const { check } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const createError = require('http-errors');
const xss = require('xss');

// Local files
const models = require('../models');
const orderQueries = require('../db/queries/orderQueries');
const productQueries = require('../db/queries/productQueries');
const {
  xssSanitize,
  errorMessages,
  filterOutNullValues,
} = require('../utils');

// Column id in table ecommerce.product
let productIds = []; // To display productids in error message

// Validation error messages
const errorMsg = {
  id: 'Id verður að vera heiltal sem er stærri en 0',
  productid: [
    'Productid verður að vera heiltala sem er stærri en 0',
    () => {
      const ids = [];
      productIds.forEach(row => ids.push(row.id));
      return `Productid verður að vera eitt af eftirfarandi id: ${ids}`;
    },
  ],
  quantity: 'Quantity verður að vera heiltala sem er stærri en 0',
  name: 'Það vantar nafn',
  address: 'Það vantar heimilisfang',
};

// Validators
const validateCartGet = [
  sanitize('id').trim(),
  check('id').isInt(({ gt: 0 }))
    .withMessage(errorMsg.id),
];

const validateCartPost = [
  sanitize('productid').trim(),
  check('productid').isInt({ gt: 0 })
    .withMessage(errorMsg.productid[0])
    .custom(async (inputId) => { // eslint-disable-line
      productIds = await productQueries.getAllProductId();
      if (productIds.find(row => row.id == inputId)) return true; // eslint-disable-line
      return false;
    })
    .withMessage(() => errorMsg.productid[1]()),

  sanitize('quantity').trim(),
  check('quantity').isInt({ gt: 0 })
    .withMessage(errorMsg.quantity),
];

const validateCartPatch = [
  sanitize('quantity').trim(),
  check('quantity').isInt({ gt: 0 })
    .withMessage(errorMsg.quantity),
];

const validateOrderPost = [
  sanitize('name').trim(),
  check('name').isLength({ min: 1 })
    .withMessage(errorMsg.name),

  sanitize('address').trim(),
  check('address').isLength({ min: 1 })
    .withMessage(errorMsg.address),
];

/**
 * Get all products in cart
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function allInCart(req, res, next) {
  const items = ['id'];
  const clean = xssSanitize(items, req.user);

  // Query everything in cart
  await orderQueries.getAllInCart(clean.id)
    .then((cart) => { // eslint-disable-line
      if (cart.length <= 0) return next(createError(400, 'NoResults'));
      res.status(200).json(cart);
    }).catch(next);
}

/**
 * Add a new product to current users cart, or update
 * if the productId is present
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function addProductToCart(req, res, next) { // eslint-disable-line
  const items = ['productid', 'quantity'];
  const clean = xssSanitize(items, req.body);
  clean.userId = xss(req.user.id);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Get users cart
  const cart = await orderQueries.getCart(clean.userId)
    .then(resultCart => resultCart)
    .catch((err) => { // eslint-disable-line
      return next(err);
    });

  const orderline = new models.Orderline();
  orderline.dataToInsert(
    clean.productid,
    clean.quantity,
  );

  // Filter out null values
  if (orderline.quantity <= 0) orderline.quantity = 1;

  // Get users cartlines
  const cartLines = await orderQueries.getCartlines(clean.userId)
    .then(resultCartLines => resultCartLines)
    .catch((err) => { // eslint-disable-line
      return next(err);
    });

  // If there are any lines check for a matching order
  if (cartLines.length > 0) {
    const cartLine = cartLines.find(row => row.productid == orderline.productid); // eslint-disable-line
    // Found matching order
    if (cartLine) {
      const totalQuantity = cartLine.quantity + parseInt(orderline.quantity, 10);

      // Update order quantity
      await orderQueries.updateQuantity(cartLine.id, totalQuantity)
        .then((resultOrderline) => { // eslint-disable-line
          return res.status(200).json(resultOrderline);
        }).catch((err) => { // eslint-disable-line
          return next(err);
        });
      return null;
    }
  }
  // Create a new order in cart
  await orderQueries.insertCartline(cart.id, orderline)
    .then((resultOrderline) => {
      res.status(200).json(resultOrderline);
    }).catch(next);
}


/**
 * Get a specific orderline in cart
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function getCartline(req, res, next) { // eslint-disable-line
  const items = ['id'];
  const clean = xssSanitize(items, req.params);
  clean.userId = xss(req.user.id);
  console.info('asdasd')
  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Query for a specific orderline in cart
  await orderQueries.getCartlines(clean.userId)
    .then((cartLines) => {
      let cartline = null;
      cartLines.forEach((line) => {
        if (line.id === parseInt(clean.id, 10)) {
          cartline = line;
        }
      });
      if (!cartline) return next(createError(400, 'NoResults'));
      return res.status(200).json(cartline);
    }).catch(next);
}

/**
 * Update specific cartlines quantity, can't be < 0
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function updateCartlineQuantity(req, res, next) { // eslint-disable-line
  const items = ['id', 'quantity'];
  const clean = xssSanitize(items, req.params, req.body);
  clean.userId = xss(req.user.id);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Filter out if null value
  if (clean.quantity === '') return next(createError(400, 'NoContent'));

  // Query for a specific orderline in cart
  await orderQueries.getCartlines(clean.userId)
    .then(async (cartLines) => { // eslint-disable-line
      let cartline = null;
      cartLines.forEach((line) => {
        if (line.id === parseInt(clean.id, 10)) {
          cartline = line;
        }
      });
      if (!cartline) return next(createError(400, 'NoResults'));

      // Update quantity in orderline
      await orderQueries.updateQuantity(cartline.id, clean.quantity)
        .then((orderline) => { // eslint-disable-line
          return res.status(200).json(orderline);
        }).catch(next);
    }).catch(next);
}

/**
 * Delete a specific cartline
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function deleteCartline(req, res, next) { // eslint-disable-line
  const items = ['id'];
  const clean = xssSanitize(items, req.params);
  clean.userId = xss(req.user.id);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  // Query for a specific orderline in cart
  await orderQueries.getCartlines(clean.userId)
    .then(async (cartLines) => { // eslint-disable-line
      let cartline = null;
      cartLines.forEach((line) => {
        if (line.id === parseInt(clean.id, 10)) {
          cartline = line;
        }
      });
      if (!cartline) return next(createError(400, 'NoResults'));

      // Delete orderline
      await orderQueries.deleteOrderline(cartline.id)
        .then((orderline) => { // eslint-disable-line
          return res.status(204).json();
        }).catch(next);
    }).catch(next);
}

/**
 * User: Get all my orders
 * Admin: Get all orders
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function allOrders(req, res, next) {
  const items = ['id', 'username', 'email', 'admin'];
  const clean = xssSanitize(items, req.user);

  // Query all orders - Admin
  if (clean.admin) {
    await orderQueries.getAllOrders()
      .then((orders) => { // eslint-disable-line
        if (orders.length <= 0) return next(createError(400, 'NoResults'));
        return res.status(200).json(orders);
      }).catch(next);
  } else { // Query all my orders
    await orderQueries.getAllOrders(clean.id)
      .then((orders) => { // eslint-disable-line
        if (orders.length <= 0) return next(createError(400, 'NoResults'));
        return res.status(200).json(orders);
      }).catch(next);
  }
}

/**
 * Create order from cart
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function createOrder(req, res, next) { // eslint-disable-line
  const items = ['name', 'address'];
  const clean = xssSanitize(items, req.params, req.body);
  clean.userId = xss(req.user.id);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  const order = new models.Order();
  order.dataToInsert(
    req.user.id,
    clean.name,
    clean.address,
    false,
  );

  // Fields and values for update query
  const { fields, values } = filterOutNullValues(order);

  const orderlines = await orderQueries.getOrderlines(clean.userId)
    .then(orders => orders)
    .catch((err) => { // eslint-disable-line
      return next(err);
    });

  // No orders - return no results
  if (orderlines.length <= 0) return next(createError(400, 'NoResults'));

  // Update cart to an order, (cart -> order)
  await orderQueries.cartToOrder(clean.userId, fields, values)
    .then((orders) => {
      if (orders.lenght <= 0) return next(createError(304, 'NoResults'));
      return res.status(200).json(orders);
    }).catch(next);
}

/**
 * Return an order with all orderlines
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Next route
 */
async function orderById(req, res, next) { // eslint-disable-line
  const items = ['id'];
  const clean = xssSanitize(items, req.params);
  clean.userId = xss(req.user.id);
  clean.admin = xss(req.user.admin);

  // Check for errors
  const errors = errorMessages(req);
  if (errors) return res.status(400).json(errors);

  await orderQueries.getAllInOrder(clean.id)
    .then((orders) => { // eslint-disable-line
      if (!orders) return next(createError(400, 'NoResults'));
      res.status(200).json(orders);
    }).catch(next);
}

module.exports = {
  validateCartGet,
  validateCartPost,
  validateCartPatch,
  validateOrderPost,
  allInCart,
  addProductToCart,
  getCartline,
  updateCartlineQuantity,
  deleteCartline,
  allOrders,
  createOrder,
  orderById,
};
