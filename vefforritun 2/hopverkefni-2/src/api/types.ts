// Category
export interface ICategory {
  id: number;
  name: string;
}

// Product
export interface IProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: ICategory;
  categoryid: number;
  description: string;
  created?: Date;
  updated?: Date;
}

// Single orderline
export interface IOrderline {
  id: number;
  orderid: number;
  productid: number;
  quantity: number;
  created: string;
  updated: string;
}

// Products in an order
export interface IOrderlines {
  id: number;
  orderid: number;
  productid: number;
  product: IProduct; // Changed
  quantity: number;
  total: number; // Changed
  created?: Date;
  updated?: Date;
}

// Order info and products in orderline
export interface IOrder {
  id: number;
  userid: number;
  cart: Boolean;
  name: string;
  address: string;
  orderlines: IOrderlines[];
  total: string;
  created?: Date;
  updated?: Date;
}

// Multiple orders
export interface IOrders {
  id: number;
  userid: number;
  cart: Boolean;
  name: string;
  address: string;
  created?: Date;
  updated?: Date;
}

// User
export interface IUser {
  admin: boolean;
  email: string;
  token: string;
  username: string;
}

// Authorization
export interface IAuth {
  user: IUser;
  isUser: boolean;
  isAdmin: boolean;
  authLoading: boolean;
  match?: any;
  history?: any;
}

// Error messages
export interface IError {
  errors: string[],
  field: string;
  location: string;
}