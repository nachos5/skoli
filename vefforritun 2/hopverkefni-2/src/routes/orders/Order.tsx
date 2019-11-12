import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Api
import { IOrder, IOrderlines, IError } from '../../api/types';
import { getOrder } from '../../api/index';
// Components
import Spinner from '../../components/spinner/Spinner';
// Routes
import NotFound from '../system-pages/NotFound';
import NoAccess from '../system-pages/NoAccess';
// ./
import './Order.scss';

export default function Order(props: any) {
  const { history, match, isUser, isAdmin } = props;

  // Data
  const [order, setOrder] = useState<IOrder>({} as IOrder);
  const [orderlines, setOrderlines] = useState<IOrderlines[]>([]);
  // Different states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<IError[]>([])

  /**
   * Initial state
   */
  useEffect(() => {
    const fetch = async () => {
      await getOrder(match.params.id)
        .then((result) => {
          if (!result.isOk) setError(result.data);
          else {
            setOrder(result.data);
            setOrderlines(result.data.orderlines);
          }
        })
      
      setLoading(false);
    }
    fetch();
  }, []);

  /**
   * Handle click event on row and go to product
   * @param e - event
   */
  async function handleOnClick(e: any) {
    e.preventDefault();
    const id = e.currentTarget.id
    history.push(`/product/${id}`);
  }

  if (!isUser || !isAdmin) return <NoAccess/>
  if (error.length > 0) return <NotFound/>
  if (loading) return <Spinner />

  return (
    <div className='order'>
      <h2>{`Pöntun #${order.id}`}</h2>
      <div className='order__info'>
        <div className='order__info--item'>
          <p>Nafn</p>
          <p>{order.name}</p>
        </div>
        <div className='order__info--item'>
          <p>Heimilisfang</p>
          <p>{order.address}</p>
        </div>
        <div className='order__info--item'>
          <p>Búin til</p>
          <p>{order.created}</p>
        </div>
      </div>
      <table className='order__table'>
        <thead>
        <tr>
          <th>Vara</th>
          <th>Verð</th>
          <th>Fjöldi</th>
          <th>Samtals</th>
        </tr>
        </thead>
        <tbody>
            {orderlines.map((item, i) => {
              return (
                <tr key={i} id={`${item.product.id}`} onClick={handleOnClick}>
                  <td>{item.product.name}</td>
                  <td>{`${item.product.price} kr.`}</td>
                  <td>{item.quantity}</td>
                  <td>{`${item.total} kr.`}</td>
                </tr>
              )
            })}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td className='order__table--total'>{order.total}</td>
            </tr>
        </tbody>
      </table>
      <Link className='order--link' to='/orders'>Aftur í pantanir</Link>
    </div>
  );
}
