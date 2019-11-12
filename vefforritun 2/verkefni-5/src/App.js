import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import './App.scss';

import Home from './routes/home/Home';
import Lecture from './routes/lecture/Lecture';
import NotFound from './routes/notfound/NotFound';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faIgloo, faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons'

library.add(faIgloo, faLongArrowAltLeft)

class App extends Component {
  render() {
    return (
      <main className="App">
        <section>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/:slug" component={Lecture} />
            <Route component={NotFound} />
          </Switch>
        </section>
      </main>
    );
  }
}

export default App;
