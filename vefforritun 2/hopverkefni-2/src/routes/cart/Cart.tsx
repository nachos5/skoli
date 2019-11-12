import React, { useState, useEffect } from 'react';

import './Cart.scss';
import { IAuth } from '../../api/types';
import { getCategories, getCart, createOrder } from '../../api';
import Spinner from '../../components/spinner/Spinner';
import Cartline from '../../components/cartline/Cartline';
import Input from '../../components/input/TextInput';

export default function Cart(props: IAuth) {
  const { history, user, isUser, isAdmin, authLoading } = props;
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isUser) {
      history.push({
        pathname: '/login',
        state: { detail: 'cart' }
      })
    }
    fetchCart();
  }, [])

  async function fetchCart() {
    setLoading(true);
    const cart = await getCart();
    setCartData(cart);
    setTotalPrice(cart.data.total)
    setLoading(false);
  }

  async function cartToOrder(e: any) {
    e.preventDefault();
    setDisabled(true);
    const nafn = e.target[0].value;
    const heimilisfang = e.target[1].value;
    const results = await createOrder(nafn, heimilisfang);
    const { status } = results;
    if (status) {
      history.push({
        pathname: '/',
        state: { detail: 'order' }
      })
    } else {
      setError(true);
    }
    setDisabled(false);
  }

  async function updateTotalPrice() {
    const cart = await getCart();
    setTotalPrice(cart.data.total)
  }

  if (cartData && cartData.data.cartlines.length === 0)
    return <p>Karfan þín er tóm.</p>

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>

          <div className="col-12 cart-container">
            {cartData.data.cartlines.map((line: any, i: number) => {
              return <Cartline key={i} lineInit={line} updateTotalPrice={updateTotalPrice} />
            })}
          </div>

          <hr className="d-none d-md-block" />
          
          {!loading ? (
            <div className="col-12 row">
              <div className="col-10"></div>
              <p className="font-weight-bold">Heildarverð: {totalPrice}</p>
            </div>
          ) : null}

          <form className="col-4 d-flex flex-column p-0" onSubmit={cartToOrder}>
            <h3 className="p-0 mb-3">Senda inn pöntun:</h3>
            <div className="col-12 d-flex flex-row p-0 mb-3">
              <label className="col-4 p-0 m-0">Nafn: </label>
              <Input className="col-8"/>
            </div>
            <div className="col-12 d-flex flex-row p-0 mb-3">
              <label className="col-4 p-0 m-0">Heimilisfang: </label>
              <Input className="col-8" />
            </div>
            <button className="col-6 btn btn-outline-primary" disabled={disabled}>Senda</button>
            {error ? (
              <p className="text-danger">Villa!</p>
            ) : null}
          </form>

        </>
      )}
    </>
  );
}