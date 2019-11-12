import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Image extends Component {
  static propTypes = {
    content: PropTypes.object
  }

  render() {
    const { content } = this.props;

    return (
      <div className="w-100 h-100 d-flex justify-content-center">
        <div className="w-75 h-75 d-flex flex-column align-items-center">
          <img className="mt-5" src={content.data} alt="" />
          {(content.caption) ? (
            <figcaption className="mb-4">{content.caption}</figcaption>
          ) : (<div className="mb-4" />)}
        </div>
      </div>
    )
  }
}
