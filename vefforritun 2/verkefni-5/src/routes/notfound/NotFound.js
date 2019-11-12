import React, { Component } from 'react';
import Helmet from 'react-helmet';

import Header from '../../components/header/Header';
import TilBaka from '../../components/lecture/TilBaka'

export default class NotFound extends Component {
  render() {
    return (
      <div>
        <Helmet title="Síðan fannst ekki" />
        <Header category="Vefforritun" title="Fyrirlestrar" image="img/header.jpg" />
        <div className="container">
          <TilBaka />
          <h1 className="text-center">Síðan fannst ekki</h1>
        </div>
      </div>
    );
  }
}
