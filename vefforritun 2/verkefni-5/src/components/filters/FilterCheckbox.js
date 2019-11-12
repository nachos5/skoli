import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class FilterCheckbox extends Component {
  static propTypes = {
    display: PropTypes.string,
    val: PropTypes.string,
    isChecked: PropTypes.bool,
    filterChange: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.changeHandler = this.changeHandler.bind(this);
  }
  
  changeHandler(e) {
    this.props.filterChange(e.target.value);
  }

  render() {
    const { display, val, isChecked } = this.props;

    return (
      <div className="form-check form-check-inline">
        <input className="form-check-input" type="checkbox" id={val} value={val} checked={isChecked} onChange={this.changeHandler} />
        <label className="form-check-label" htmlFor={val}>
          {display}
        </label>
      </div>
    )
  }
}
