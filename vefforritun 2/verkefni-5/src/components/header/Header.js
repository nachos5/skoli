import React from 'react';
import PropTypes from 'prop-types';

import './Header.scss';

export default class Header extends React.Component {
  constructor(props) {
    super(props)
  
    this.backImage = {
      backgroundImage: `url("${this.props.image}")`
    }
  }
  

  static propTypes = {
    category: PropTypes.string,
    title: PropTypes.string,
  }

  render() {
    const { category, title } = this.props;

    return (
      <header className="heading heading--main" style={this.backImage}>
        <span className="heading__category">{category}</span>
        <h1 className="heading__title">{title}</h1>
      </header>
    );
  }
}
