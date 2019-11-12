const bcrypt = require('bcrypt');

class Category {
  dataToGet(id, name, created = null, updated = null) {
    this.id = id;
    this.name = name;
    this.created = created;
    this.updated = updated;
  }

  dataToInsert(name) {
    this.name = name;
  }
}

class Product {
  dataToGet(id, name, price, description, image, categoryid, created = null, updated = null) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
    this.categoryid = categoryid;
    this.created = created;
    this.updated = updated;
  }

  dataToInsert(name, price, description, image, categoryid) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
    this.categoryid = categoryid;
  }
}

class User {
  dataToGet(id, username, email, password, admin, created = null, updated = null) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.admin = admin;
    this.created = created;
    this.updated = updated;
  }

  dataToInsert(username, email, password, admin = false) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.admin = admin;
  }

  dataToUpdate(email, password) {
    this.email = email;
    this.password = password;
  }

  /**
   * útbýr hash fyrir lykilorð notandans
   * @param {number} saltRounds umferðir
   */
  async hashedPassword(saltRounds = 10) {
    const pwHash = await bcrypt.hash(this.password, saltRounds).then(hash => hash);

    return pwHash;
  }

  async comparePasswords(passwordString) {
    const match = await bcrypt.compare(passwordString, this.password);
    return match;
  }
}

class Order {
  dataToGet(id, userid, name, address, cart = true, created = null, updated = null) {
    this.id = id;
    this.userid = userid;
    this.cart = cart;
    this.name = name;
    this.address = address;
    this.created = created;
    this.updated = updated;
  }

  dataToInsert(userid, name, address, cart = true) {
    this.userid = userid;
    this.name = name;
    this.address = address;
    this.cart = cart;
  }
}

class Orderline {
  dataToGet(id, orderid, productid, quantity, created, updated) {
    this.id = id;
    this.orderid = orderid;
    this.productid = productid;
    this.quantity = quantity;
    this.created = created;
    this.updated = updated;
  }

  dataToInsert(productid, quantity) {
    this.productid = productid;
    this.quantity = quantity;
  }
}


module.exports = {
  Category, Product, User, Order, Orderline,
};
