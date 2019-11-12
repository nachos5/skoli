import React, { useState, useEffect, Fragment } from 'react';
import Helmet from 'react-helmet';

// Api
import { getProductsByCategoryId, getProduct } from '../../api';
import { IProduct, IAuth, IError } from '../../api/types';
// Components
import Product from '../../components/product/Product';
import Products from '../../components/products/Products';
import Spinner from '../../components/spinner/Spinner';
// Routes
import NotFound from '../system-pages/NotFound';
// ./
import './Product.scss';

export default function Home(props: IAuth) {
  const { user, isUser, match } = props;
  const { id } = match.params;

  // Data
  const [product, setProduct] = useState<IProduct>({} as IProduct); // Currently showcased product
  const [products, setProducts] = useState<IProduct[]>(); // List of products
  // Different states
  const [loading, setLoading] = useState(true);
  const [partialLoading, setPartialLoading] = useState(false);
  const [error, setError] = useState<IError[]>([]);

  /**
   * Initial state
   */
  useEffect(() => {
    fetchData(id);
  }, []);

  /**
   * Get data for the initial state
   * @param id - product id
   */
  async function fetchData(id: number) {
    window.scrollTo(0, 0);
    await getProduct(id)
      .then(async (result) => {
        if (!result.isOk) setError(result.data);
        else {
          setProduct(result.data);
          await getProductsByCategoryId(result.data.categoryid)
            .then((result) => {
              if (!result.isOk) setError(result.data);
              else setProducts(result.data)
            })
        }
      })
       
    setLoading(false);
    setPartialLoading(false);
  }

  /**
   * Update showcased product
   * @param id - product id
   */
  function update(id: number) {
    setPartialLoading(true);
    fetchData(id);
  }

  if (error.length > 0) return <NotFound/>
  if (loading) return <Spinner />

  return (
    <Fragment>
      <Helmet title={product.name} />
      
      {(partialLoading) ? (
        <>
        <div className="productDetails productDetails__blur">
          <Product
            product={product || {} as IProduct}
            loading={loading}
            user={user}
            isUser={isUser}
          />
        </div>
        <Spinner />
        </>
      ) : (
       <div className="productDetails"> 
        <Product 
          product={product || {} as IProduct}
          loading={loading}
          user={user}
          isUser={isUser}
        />
      </div>
      )}

      <h2 className="mb-5 mt-5 pt-5">Meira úr {product.category.name}</h2>
      <Products
        products={products || []}
        update={update}
      />

    </Fragment>
  );
}
