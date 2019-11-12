import React, { useState, useEffect } from 'react';

// Api
import { IOrders, IError } from '../../api/types';
import { getOrders } from '../../api/index';
// Components
import Spinner from '../../components/spinner/Spinner';
// Routes
import NotFound from '../system-pages/NotFound';
import NoAccess from '../system-pages/NoAccess';
// ./
import './Orders.scss';

export default function Orders(props: any) {
  const { history , isUser, isAdmin} = props;

  // Data
  const [orders, setOrders] = useState<IOrders[]>([]);
  // Different states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<IError[]>([]);

  /**
   * Initial state
   */
  useEffect(() => {
    const fetch = async () => {
      await getOrders()
        .then((result) => {
          if (!result.isOk) setError(result.data);
          else setOrders(result.data);
        })

      setLoading(false);
    }
    fetch();
  }, []);

  /**
   * Handle click event on row
   * and go to order
   * @param e - event
   */
  async function handleOnClick(e: any) {
    e.preventDefault();
    const id = e.currentTarget.id
    history.push(`/orders/${id}`);
  }

  if (!isUser || !isAdmin) return <NoAccess/>
  if (error.length > 0) return <NotFound/>
  if (loading) return <Spinner />

  return (
    <div className='orders'>
      <h2>Þínar pantanir</h2>
      <table className='orders__table'>
        <thead>
        <tr>
          <th>Pöntun</th>
          <th>Nafn</th>
          <th>Heimilisfang</th>
          <th>Búin til</th>
        </tr>
        </thead>
        <tbody>
          {orders.map((item, i) => {
            return (
              <tr key={i} id={`${item.id}`} onClick={handleOnClick}>
                <td>{`Pöntun #${item.id}`}</td>
                <td>{item.name}</td>
                <td>{item.address}</td>
                <td>{item.created}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
