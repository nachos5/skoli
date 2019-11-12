import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet';

import { getLecture } from '../../api';

import Header from '../../components/header/Header';
import Lecture from '../../components/lecture/Lecture';
import NotFound from '../notfound/NotFound';

export default class Home extends Component {

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        slug: PropTypes.string,
      }),
    }),
  }

  state = {
    // sækjum fyrirlestur eftir param-sluginu
    data: getLecture(this.props.match.params.slug),
  }

  render() {
    const { lecture, klaradur } = this.state.data;

    // ekki fyrirlestur með þessu slugi
    if (!lecture) {
      return (
        <Route component={NotFound} />
      )
    }

    return (
      <React.Fragment>
        <Helmet title={lecture.title} />
        {(lecture.image) ? (
          <Header category={lecture.category} title={lecture.title} image={lecture.image} />
        ) : (
          <Header category={lecture.category} title={lecture.title} image="/img/header.jpg" />
        )}
        <Lecture lecture={lecture} klaradur={klaradur} />
      </React.Fragment>
    );
  }
}
