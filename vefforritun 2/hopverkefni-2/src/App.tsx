import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { Route, Switch, withRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';

import Header from './components/header/Header';

import Home from './routes/home/Home';
import Register from './routes/register/Register';
import Login from './routes/login/Login';
import Logout from './routes/logout/Logout';
import Categories from './routes/categories/Categories';
import Category from './routes/category/Category';
import Product from './routes/product/Product';
import Cart from './routes/cart/Cart';
import Orders from './routes/orders/Orders';
import Order from './routes/orders/Order';

import NotFound from './routes/system-pages/NotFound';

import './App.scss';
import { getUserMe } from './api';
import Footer from './components/footer/Footer';

type Props = {
  location: Location;
};

function App(props: Props) {

  const [user, setUser] = useState();
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserMe();
      
      // If there is a user logged in
      if (user.isOk) {
        setUser(user.data);
        setIsUser(true);
        setIsAdmin(user.data.admin);
      }
      setAuthLoading(false);
    }
    fetchData();
  }, [])

  return (
    <React.Fragment>
      <Helmet defaultTitle="Vefforritunarbúðin" titleTemplate="%s – Vefforritunarbúðin" />


      <div className="app container-fluid p-0">
        <Header 
          user={user}
          isUser={isUser}
          isAdmin={isAdmin}
          authLoading={authLoading}
        />

        <main className="main__content container">
          <Switch location={props.location}>
            <Route path="/" exact component={Home} />
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={(props: any) => 
              <Login 
                {...props}
                setUser={setUser}
                setIsUser={setIsUser}
                setIsAdmin={setIsAdmin}
              />
            }/>
            <Route path='/logout' exact component={(props: any) =>
              <Logout
                {...props}
                setUser={setUser}
                setIsUser={setIsUser}
                setIsAdmin={setIsAdmin}
              />
            }/>
            <Route path="/categories/" exact component={Categories} />
            <Route path="/categories/:id" exact component={Category} />
            <Route path="/product/:id" exact component={(props: any) => 
              <Product
                {...props}
                user={user}
                isUser={isUser}
                isAdmin={isAdmin}
                authLoading={authLoading}
              />
            } />
            <Route path="/cart" exact component={(props: any) =>
              <Cart
                {...props}
                user={user}
                isUser={isUser}
                isAdmin={isAdmin}
                authLoading={authLoading}
              />
            } />
            <Route path="/orders" exact component={(props: any) =>
              <Orders
                {...props}
                isUser={isUser}
                isAdmin={isAdmin}
              />
            } />
            <Route path="/orders/:id" exact component={(props: any) =>
              <Order
                {...props}
                isUser={isUser}
                isAdmin={isAdmin}
              />
            } />
            <Route component={NotFound} />
          </Switch>
        </main>

        <Footer />

      </div>
    </React.Fragment>
  );
}

export default withRouter(App);
