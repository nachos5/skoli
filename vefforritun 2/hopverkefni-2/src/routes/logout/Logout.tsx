import React, { useState } from 'react';

// Components
import Spinner from '../../components/spinner/Spinner';
// ./
import './Logout.scss';

export default function Logout(props: any) {
  const {history, setUser, setIsUser, setIsAdmin } = props;
  // Different states
  const [loading, setLoading] = useState(true);

  /**
   * Reset authorization values to default
   */
  async function logout() {
    setUser(null);
    setIsUser(false);
    setIsAdmin(false);

    localStorage.removeItem('jwt'); // Remove jwt from locals
    history.push('/'); // Redirect
  }

  logout();

  return (
    <div className='logout'>
      {loading && <Spinner />}
    </div>
  )
}
