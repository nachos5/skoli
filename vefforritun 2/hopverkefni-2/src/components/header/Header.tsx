import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Api
import { IAuth } from '../../api/types';
// ./
import './Header.scss';

export default function Header(props: IAuth) {
  const { user, isUser, authLoading } = props;

  return (
    <>
      <header className="col-12 header">
        <div className="col-12 flex-column flex-md-row header__content">
          <h1 className="col-12 col-md-7 col-xl-8 header__title">
            <Link className="col-12 header__titleLink" to="/">Vefforritunarbúðin</Link>
          </h1>
          <div className="col-12 col-sm-8 col-md-5 col-xl-4 header__links">
          
          {!authLoading ? (
            <>
            
            {isUser ? (
              <>
                <div className="col-4 header__link__container">
                  <NavLink className="pt-2 pb-2 header__link" activeClassName="header__link--selected" exact to="/logout">
                    <FontAwesomeIcon icon="user-plus" className="icons" /> {`${user.username} (útskrá)`}
                  </NavLink>
                </div>
                <div className="col-4 header__link__container">
                  <NavLink className="header__link" activeClassName="header__link--selected" exact to="/orders">
                    <FontAwesomeIcon icon="user" className="icons" /> Pantanir
                  </NavLink>
                </div>
              </>
            ) : (
              <>
                <div className="col-4 header__link__container">
                  <NavLink className="pt-2 pb-2 header__link" activeClassName="header__link--selected" exact to="/register">
                    <FontAwesomeIcon icon="user-plus" className="icons" /> Nýskrá
                  </NavLink>
                </div>
                <div className="col-4 header__link__container">
                  <NavLink className="header__link" activeClassName="header__link--selected" exact to="/login">
                    <FontAwesomeIcon icon="user" className="icons" /> Innskrá
                  </NavLink>
                </div>
              </>
            )}

              <div className="col-4 header__link__container">
                <NavLink className="header__link" activeClassName="header__link--selected" exact to="/cart">
                  <FontAwesomeIcon icon="shopping-cart" className="icons" /> Karfa
                </NavLink>        
              </div>
              <div className="col-6 col-md-4 header__link__container">
                <NavLink className="header__link" activeClassName="header__link--selected" exact to="/">
                  <FontAwesomeIcon icon="tag" className="icons" /> Nýjar vörur
                </NavLink>
              </div>
              <div className="col-6 col-md-4 header__link__container">
                <NavLink className="header__link" activeClassName="header__link--selected" exact to="/categories">
                  <FontAwesomeIcon icon="bars" className="icons" />  Flokkar
                </NavLink>
              </div>

            </>       
          ) : null}

          </div>
        </div>
      </header>
      <div className="mb-5"></div>
    </>
  );
}
