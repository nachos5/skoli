import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Youtube.scss'

export default class Youtube extends Component {
  static propTypes = {
    content: PropTypes.object
  }

  render() {
    const { content } = this.props;

    return (
      <div className="myndband">
        <iframe className="myndband__iframe" src={content.data} title={content.data} frameBorder="0" allowFullScreen />
      </div>
    )
  }
}