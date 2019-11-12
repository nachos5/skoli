import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { IProduct } from '../../api/types';

interface Props {
  product: IProduct,
  update?: any
}

export default function ProductContainer(props: Props) {
  const { product, update } = props;
  const { category } = product;
  function handler() {
    if (update !== undefined || update !== null) {
      update(product.id);
    }
  }

  return (     
    <Link className='col-12 col-md-6 col-lg-4 products--grid__link' id={'' + product.id} to={"/product/" + product.id} onClick={handler} >
      <img className='products--grid__img' src={product.image} alt={product.name}/>
      <div className='products--grid__info'>              
        <div>
          <h2>{product.name}</h2>
          <p>{product.category}</p>
        </div>
        <p>{`${product.price} kr.`}</p>
      </div>
    </Link>        
  );
}
