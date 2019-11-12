import { http, httpPost, httpPatch, httpDelete, asyncForEach } from '../utils/utils';

// Url to REST api 
const baseurl: string = process.env.REACT_APP_API_URL as string;

/**
 * Get all products
 */
async function getProducts() {
  const path = 'products';
  const url = new URL(path, baseurl);

  const resultProducts = await http(url.href);
  resultProducts.data.forEach(async (item: any) => {
    const cat = await getCategory(item.categoryid);
    item.category = cat.data.name;
  })

  return resultProducts;
}

/**
 * Get products in category from page number 0 - page
 * that match the search string
 * 
 * @param id - category id
 * @param page - page number
 * @param query - search string
 */
async function getProductsByCatgegoryIdPages(id: number, page: number = 0, query: string = '') {

  const resultTotalProducts = [];
  let status = 200;
  let isOk = true;

  for (let i = 0; i < page + 1; i++) {
    const resultProduct = await getProductsByCategoryId(id, i, query);
    resultTotalProducts.push(...resultProduct.data);
    if (resultProduct.status !== 200) {
      status = resultProduct.status;
      isOk = false;
      break;
    }
  }
  return {
    data: resultTotalProducts,
    status: status,
    isOk: isOk,
  }
}

/**
 * Get products in category on a specific page
 * and that match the search string
 * 
 * @param id - category id
 * @param page - page number
 * @param query - search string
 */
async function getProductsByCategoryId(id: number, page: number = 0, query: string = '') {
  let path = `products?category=${id}&page=${page}`;
  if (query.length > 0) {
    path += `&search=${query}`;
  }
  const url = new URL(path, baseurl);

  const resultProducts = await http(url.href);
  const category= await getCategory(resultProducts.data[0].categoryid);
  resultProducts.data.forEach((p: any) => {
    p.category = category.data.name;
  })
  return resultProducts
}

/**
 * Get a single product
 * 
 * @param id - product id
 */
async function getProduct(id: number) {
  const path = `products/${id}`
  const url = new URL(path, baseurl);

  const resultProduct = await http(url.href)
    .then(async (result) => {
      const category = await getCategory(result.data.categoryid)
      result.data.category = category.data;
      return result
    })
  return resultProduct;
}

/**
 * Get the number of products that match
 * the category id and the search string
 * 
 * @param id - category id
 * @param query - search string
 */
async function getProductCount(id: number = -1, query: string = '') {
  let path = 'products/count';
  if (id !== -1) path += `?category=${id}`;
  if (query !== '') path += `&search=${query}`;
  const url = new URL(path, baseurl);

  return await http(url.href)
    .then((result) => {
      result.data.count = parseInt(result.data.count, 10);
      return result;
    })
}

/**
 * Get all categories
 */
async function getCategories() {
  const path = 'categories';
  const url = new URL(path, baseurl);

  return await http(url.href);
}

/**
 * Get category by id
 * 
 * @param id - category id
 */
async function getCategory(id: number) {
  const path = `categories/${id}`
  const url = new URL(path, baseurl);

  return await http(url.href);
}

/**
 * Add product to cart
 * 
 * @param productid - product id
 * @param quantity - quantity
 */
async function addToCart(productid: number, quantity: number) {
  const path = 'cart';
  const url = new URL(path, baseurl);

  const data = {'productid': productid, 'quantity': quantity};
  return await httpPost(url.href, data);
}

/**
 * Get logged in users cart
 */
async function getCart() {
  const path = 'cart';
  const url = new URL(path, baseurl);

  return await http(url.href);
}

/**
 * Update the quantity of a product in the cartline
 * 
 * @param id - cartline id
 * @param quantity - quanityt
 */
async function updateCartline(id: number, quantity: number) {
  const path = `cart/line/${id}`;
  const url = new URL(path, baseurl);

  const data = {'quantity': quantity};
  return await httpPatch(url.href, data);
}

/**
 * Delete product from cartline
 * 
 * @param id - cartline id
 */
async function deleteCartline(id: number) {
  const path = `cart/line/${id}`;
  const url = new URL(path, baseurl);

  return await httpDelete(url.href);
}

/**
 * Create a new order
 * 
 * @param name - name of the order
 * @param address - address of the order
 */
async function createOrder(name: string, address: string) {
  const path = 'orders';
  const url = new URL(path, baseurl);
  
  const data = {'name': name, 'address': address};
  return await httpPost(url.href, data);
}

/**
 * Method: POST
 * Register a new user
 * @param data - username, email, pw
 */
async function registerUser(data: any) {
  const path = 'users/register';
  const url = new URL(path, baseurl);

  return await httpPost(url.href, data);
}

/**
 * Method: POST
 * Login a user
 * @param data username, pw
 */
async function loginUser(data: any) {
  const path = 'users/login';
  const url = new URL(path, baseurl);

  return await httpPost(url.href, data);
}

/**
 * Get the currently logged in user
 */
async function getUserMe() {
  const path = 'users/me';
  const url = new URL(path, baseurl);

  return await http(url.href);
}

/**
 * Get all orders
 */
async function getOrders() {
  const path = '/orders';
  const url = new URL(path, baseurl);

  return await http(url.href);
}

/**
 * Get a single order by id
 * 
 * @param id - order id
 */
async function getOrder(id: number) {
  const path = `/orders/${id}`
  const url = new URL(path, baseurl);

  /**
   * Populate orderlines with product and total price of 
   * product price * product quantity
   * @param orderlines 
   */
  const populateOrderlines = async (orderlines: any) => {
    await asyncForEach(orderlines, async (item: any, i: number) => {
      orderlines[i].product = await getProduct(item.productid).then(result => result.data);
      orderlines[i].total = orderlines[i].product.price * item.quantity;
    });
    return orderlines;
  }
  
  return await http(url.href)
    .then(async (result) => {
      if (result.isOk) await populateOrderlines(result.data.orderlines);
      return result
    })
}

export {
  getProduct,
  getProducts,
  getProductsByCategoryId,
  getProductsByCatgegoryIdPages,
  getProductCount,
  getCategory,
  getCategories,
  addToCart,
  getCart,
  updateCartline,
  deleteCartline,
  createOrder,
  registerUser,
  loginUser,
  getUserMe,
  getOrder,
  getOrders,
};
