import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// Api
import { loginUser } from '../../api/index';
import { IError } from '../../api/types';
// Utils
import { checkField } from '../../utils/utils';
// Components
import Button from '../../components/button/Button';
// ./
import './Login.scss';

export default function Login(props: any) {
  const {history, setUser, setIsUser, setIsAdmin, location } = props;

  // Fields
  const [user, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Different states
  const [error, setError] = useState<IError[]>([]);

  /**
   * Handle submit from button on form,
   * try to login user
   * @param e - event
   */
  async function handleSubmit(e: any) {
    e.preventDefault();
    const data = {
      'username': user,
      'password': password,
    }

    const result = await loginUser(data);

     // Login successful, set jwt token and redirect to '/'
    if (result.isOk) {
      setUser(result.data);
      setIsUser(true);
      setIsAdmin(result.data.admin);
      localStorage.setItem('jwt', result.data.token);
      history.push('/');
    }
    if (!result.isOk) setError(result.data); // Display errors if status is not ok
  }

  /**
   * Classnames on fields to show errors
   */
  const userFieldClass = classNames({
    'login--form__field': true,
    'login--form__field--invalid': checkField(error, 'username'),
  })

  const passwordFieldClass = classNames({
    'login--form__field': true,
    'login--form__field--invalid': checkField(error, 'password'),
  })
  
  return (
    <div className='login'>

      {(location.state && location.state.detail === 'cart') ? (
        <p className="text-info">Skráðu þig inn til þess að nálgast körfuna þína:</p>
      ) : null}

      <h2>Innskráning</h2>
      { error.length > 0 &&
        <ul>
          {error.map((item, i) => {
            return (
              item.errors.map((err) => {
                return (
                  <li key={i}>{err}</li>
                )
              })
            )
          })}
        </ul>
      }
      <form className='login--form' onSubmit={handleSubmit}>
        <div className={userFieldClass}>
          <label htmlFor='user'>Notendanafn:</label>
          <input type='text' name='user' value={user} onChange={e => setUsername(e.target.value)}/>
        </div>
        <div className={passwordFieldClass}>
          <label htmlFor='password'>Lykilorð:</label>
          <input type='password' name='password' value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <Button>Skrá inn</Button>
      </form>
      <Link className='login--link' to="/register">Nýskráning</Link>
    </div>
  )
}
