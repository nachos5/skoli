import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class List extends Component {
  static propTypes = {
    content: PropTypes.object
  }

  render() {
    const { content } = this.props;

    return (
      <ul>
        {content.data.map((item, i) => {
          return <li key={i} className="mt-3 mb-3">
            {item}
          </li>
        })}
    </ul>
    )
  }
}