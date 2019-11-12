import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Api
import { addToCart } from '../../api';
// Components
import Input from '../input/NumberInput';
// ./
import './Product.scss';

interface Props {
  productid: number;
}

export default function Cart(props: Props) {
  const { productid } = props;
  const [error, setError] = useState();
  const [disabled, setDisabled] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    setDisabled(true);
    const quantity = parseInt(e.target[0].value, 10);
    const results = await addToCart(productid, quantity);
    const { status } = results;
    if (status) setError(false);
    else setError(true);
    setDisabled(false);
  }

  return (
    <div className="col-12 row">
      <form className="col-8 col-md-4 product__info--cart d-flex p-0" onSubmit={submit} >
        <div className="col-6 p-0 pr-1 d-flex justify-content-center align-items-center">
          <Input />
        </div>
        <div className="col-6 p-0 pl-1 d-flex justify-content-center align-items-center">
          <button className="btn btn-outline-info" type="submit" disabled={disabled}>
            <div className="cartIcon__container">
              <FontAwesomeIcon icon="cart-plus" size="lg" className="cartIcon text-info" />
            </div>
          </button>
        </div>
      </form>
      <div className="col-4 d-flex align-items-center">
        {(typeof error === 'undefined') ? (null) : (
          <>
            {error ? (
              <p className="text-danger m-0">Villa!</p>
            ) : (
              <p className="text-success m-0">Sett í körfu!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}