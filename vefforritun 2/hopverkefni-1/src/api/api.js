const express = require('express');

// curl -d '{}' -H "Content-Type: application/json" -X POST http://localhost:3000/
// Local files
const product = require('./product');
const category = require('./category');
const user = require('./user');
const order = require('./order');
const media = require('../media');
const { authMiddleware, authAdmin } = require('../auth');
const {
  catchErrors,
  xssSanitize,
} = require('../utils');

// Route /users information
const routeUsers = {
  '/users': {
    get: 'Skilar síðu af notendum, aðeins ef notandi sem framkvæmir er stjórnandi',
  },
  '/users?page{number}': {
    get: 'Skilar næstu síðu, {1} = fyrsta síðan',
  },
  '/users/:id': {
    get: 'Skilar notanda, aðeins ef notandinn sem framkvæmir er stjórnandi',
    patch: 'Breytir notanda, þ.m.t. hvort viðkomandi sé stjórnandi, aðeins ef notandi sem framkvæmir er stjórnandi',
  },
  '/users/register': {
    post: 'Staðfestir og býr til notanda. Skilar auðkenni og netfangi. Notandi sem búinn er til skal aldrei vera stjórnandi',
  },
  '/users/login': {
    post: 'Með netfangi og lykilorði skilar token ef gögn rétt',
  },
  '/users/me': {
    get: 'Skilar upplýsingum um notanda sem á token, auðkenni og netfangi, aðeins ef notandi innskráður',
    patch: 'Uppfærir netfang, lykilorð eða bæði ef gögn rétt, aðeins ef notandi innskráður',
  },
};

// Route /products information
const routeProducts = {
  '/products': {
    get: 'Skilar síðu af vörum raðað í dagsetningar röð, nýjustu vörur fyrst',
    post: 'Býr til nýja vöru ef hún er gild og notandi hefur rétt til að búa til vöru, aðeins ef notandi sem framkvæmir er stjórnandi',
  },
  '/products?category={category}': {
    get: 'Skilar síðu af vörum í flokk, raðað í dagsetningar röð, nýjustu vörur fyrst',
  },
  '/products?search={query}': {
    get: 'Skilar síðu af vörum þar sem {query} er í titli eða lýsingu, raðað í dagsetningar röð, nýjustu vörur fyrst',
  },
  '/products?page{number}': {
    get: 'Skilar næstu síðu, {1} = fyrsta síðan',
    info: 'Það er hægt að senda search, category og page, allt í einu',
  },
  '/products/:id': {
    get: 'Sækir vöru',
    patch: 'Uppfærir vöru, aðeins ef notandi sem framkvæmir er stjórnandi',
    delete: 'Eyðir vöru, aðeins ef notandi sem framkvæmir er stjórnandi',
  },
};

// Route /categories information
const routeCategories = {
  '/categories': {
    get: 'Skilar síðu af flokkum, 10 flokkar á síður',
    post: 'Býr til flokk ef gildur og skilar, aðeins ef notandi sem framkvæmir er stjórnandi',
  },
  '/categories?page{number}': {
    get: 'Skilar næstu síðu, {1} = fyrsta síðan',
  },
  '/categories/:id': {
    patch: 'Uppfærir flokk, aðeins ef notandi sem framkvæmir er stjórnandi',
    delete: 'Eyðir flokk og öllum vörum í þeim flokki, aðeins ef notandi sem framkvæmir er stjórnandi',
  },
};

// Route /catt information
const routeCart = {
  '/cart': {
    get: 'Skilar körfu fyrir notanda með öllum línum og reiknuðu heildarverði körfu, aðeins ef notandi er innskráður',
    post: 'Bætir vöru við í körfu, krefst fjölda og auðkennis á vöru, aðeins ef notandi er innskráður',
  },
  '/cart/line/:id': {
    get: 'Skilar línu í körfu með fjölda og upplýsingum um vöru, aðeins ef notandi er innskráður',
    patch: 'Uppfærir fjölda í línu, aðeins ef notandi er innskráður, aðeins fyrir línu í körfu sem notandi á',
    delete: 'Eyðir línu úr körfu, aðeins ef notandi er innskráður, aðeins fyrir línu í körfu sem notandi á',
  },
};

// Route /orders information
const routeOrders = {
  '/orders': {
    get: 'Skilar síðu af pöntunum, nýjustu pantanir fyrst, aðeins pantanir notanda ef ekki stjórnandi, annars allar pantanir',
    post: 'Býr til pöntun úr körfu með viðeigandi gildum, aðeins ef notandi er innskráður',
  },
  'orders/:id': {
    get: 'Skilar pöntun með öllum línum, gildum pöntunar og reiknuðu heildarverði körfu, aðeins ef notandi á pöntun eða notandi er stjórnandi',
  },
};

// All routes
const routes = {
  users: routeUsers,
  products: routeProducts,
  categories: routeCategories,
  cart: routeCart,
  orders: routeOrders,
};

/**
 * List all available routes and their methods
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function listRoutes(req, res) {
  return res.status(200).json(routes);
}

/**
 * Error handler for unsupported routes
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function unsupportedRoutes(req, res) {
  const items = ['method', 'url'];
  const clean = xssSanitize(items, req);

  return res.status(404).json({
    error: `Method: ${clean.method} is not supported on route: ${clean.url}`,
  });
}

const router = express.Router();

router.get('/', catchErrors(listRoutes));

// Categories
router.get('/categories', category.validateCategoryGet, catchErrors(category.allCategories));
router.post('/categories', authMiddleware, authAdmin, category.validateCategoryPost, catchErrors(category.createCategory)); // Admin
router.get('/categories/:id', category.validateCategory, catchErrors(category.categoryById));
router.patch('/categories/:id', authMiddleware, authAdmin, category.validateCategoryPost, catchErrors(category.updateCategory)); // Admin
router.delete('/categories/:id', authMiddleware, authAdmin, category.validateCategory, catchErrors(category.deleteCategory)); // Admin

// Products
router.get('/products', product.validateProductGet, catchErrors(product.allProducts));
router.get('/products/count', catchErrors(product.productCount));
router.post('/products', authMiddleware, authAdmin, product.validateProductPost, catchErrors(product.createProduct)); // Admin
router.get('/products/:id', product.validateProductGetId, catchErrors(product.productById));
router.patch('/products/:id', authMiddleware, authAdmin, product.validateProductPatch, catchErrors(product.updateProduct)); // Admin
router.delete('/products/:id', authMiddleware, authAdmin, product.validateProductGetId, catchErrors(product.deleteProduct)); // Admin

// Users
router.get('/users', authMiddleware, authAdmin, user.validateUserGet, catchErrors(user.allUsers)); // Admin
router.get('/users/me', authMiddleware, catchErrors(user.myUser)); // Login
router.patch('/users/me', authMiddleware, user.validateUserUpdate, catchErrors(user.updateMyUser)); // Login
router.get('/users/:id', authMiddleware, authAdmin, user.validateUserParam, catchErrors(user.userById)); // Admin
router.patch('/users/:id', authMiddleware, authAdmin, user.validateUserParam, catchErrors(user.changeAdminStatus)); // Admin

// Cart
router.get('/cart', authMiddleware, catchErrors(order.allInCart)); // Login
router.post('/cart', authMiddleware, order.validateCartPost, catchErrors(order.addProductToCart)); // Login
router.get('/cart/line/:id', authMiddleware, order.validateCartGet, catchErrors(order.getCartline)); // Login
router.patch('/cart/line/:id', authMiddleware, order.validateCartPatch, catchErrors(order.updateCartlineQuantity)); // Login
router.delete('/cart/line/:id', authMiddleware, order.validateCartGet, catchErrors(order.deleteCartline)); // Login

// Orders
router.get('/orders', authMiddleware, catchErrors(order.allOrders)); // Login (special case for admin)
router.post('/orders', authMiddleware, order.validateOrderPost, catchErrors(order.createOrder)); // Login
router.get('/orders/:id', authMiddleware, order.validateCartGet, catchErrors(order.orderById)); // Login (special case for admin)

// Media
router.post('/images', authMiddleware, catchErrors(media.uploadImagesReq));

// All other routes are unsupported
router.all('*', catchErrors(unsupportedRoutes));

module.exports = router;
