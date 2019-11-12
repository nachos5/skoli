import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.scss';
import App from './App';

import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faCartPlus,
  faShoppingCart,
  faUser,
  faUserPlus,
  faTag,
  faBars,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faCartPlus,
  faShoppingCart,
  faUser,
  faUserPlus,
  faTag,
  faBars,
  faSearch
)

ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  document.getElementById('root'),
);
