import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// Api
import { registerUser } from '../../api/index';
import { IError } from '../../api/types';
// Utils
import { checkField } from '../../utils/utils';
// Components
import Button from '../../components/button/Button';
// ./
import './Register.scss';

export default function Register(props: any) {
  const { history } = props;
  // Fields
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  // Errors
  const [error, setError] = useState<IError[]>([]);

  /**
   * Handle submit button from form
   * @param e - event
   */
  async function handleSubmit(e: any) {
    e.preventDefault();
    const data = {
      'username': user,
      'password': password,
      'email': email,
    }
    
    const result = await registerUser(data);
    
    if (result.status) history.push('/login'); // Register successful, redirect to '/login'
    if (!result.status) setError(result.data); // Display errors if status is not ok
  }

  /**
   * Classnames on fields to show errors
   */
  const userFieldClass = classNames({
    'register--form__field': true,
    'register--form__field--invalid': checkField(error, 'username'),
  })

  const passwordFieldClass = classNames({
    'register--form__field': true,
    'register--form__field--invalid': checkField(error, 'password'),
  })

  const emailFieldClass = classNames({
    'register--form__field': true,
    'register--form__field--invalid': checkField(error, 'email'),
  })

  return (
    <div className='register'>
      <h2>Nýskráning</h2>
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
      <form className='register--form' onSubmit={handleSubmit}>
        <div className={userFieldClass}>
          <label htmlFor='user'>Notendanafn:</label>
          <input type='text' name='user' value={user} onChange={e => setUser(e.target.value)}/>
        </div>
        <div className={passwordFieldClass}>
          <label htmlFor='password'>Lykilorð:</label>
          <input type='password' name='password' value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div className={emailFieldClass}>
          <label htmlFor='email'>Netfang:</label>
          <input type='text' name='email' value={email} onChange={e => setEmail(e.target.value)}/>
        </div>
        <Button>Nýskrá</Button>
      </form>
      <Link className='register--link' to="/login">Innskráning</Link>
    </div>
  )
}
