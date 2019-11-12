import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Quote extends Component {
  static propTypes = {
    content: PropTypes.object
  }

  render() {
    const { content } = this.props;

    return (
      <div className="w-100 d-flex flex-column p-3 mt-3 mb-3 quote">
        <p className="m-auto quote__texti">
          {content.data}
        </p>
        {/* attribute í quote-i, - nafn */}
        {(content.attribute) ? (
          <p className="m-auto">
            - {content.attribute}
          </p>
        ) : (null)}
    </div>
    )
  }
}