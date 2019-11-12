import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './TilBaka.scss'

export default class TilBaka extends Component {
  render() {
    return (
      <div className="col-12">
        <div className="col-2 d-flex align-items-center" id="tb-container">
          <FontAwesomeIcon icon="long-arrow-alt-left" id="arrow" />
          <Link to="/" id="tilbaka">Til baka</Link>
        </div>
      </div>
    )
  }
}