const { getProductById } = require('./db/queries/productQueries');

async function totalPrice(orderlines) {
  let total = 0;
  // margar línur
  if (orderlines instanceof Array) {
    for (let i = 0; i < orderlines.length; i += 1) {
      const product = await getProductById(orderlines[i].productid);
      total += product.price * orderlines[i].quantity;
    }
  // ein lína
  } else {
    const product = await getProductById(orderlines.productid);
    total = product.price * orderlines.quantity;
  }
  return total;
}

module.exports = {
  totalPrice,
};
