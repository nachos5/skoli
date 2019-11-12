import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FilterCheckbox from './FilterCheckbox'

export default class Filters extends Component {
  static propTypes = {
    filterChange: PropTypes.func,
    filters: PropTypes.array
  }

  render() {
    const { filterChange, filters } = this.props;
    
    return (
      <form id="filters" className="row d-flex m-5 justify-content-center align-items-center">
        <FilterCheckbox display="HTML" val="html" filterChange={filterChange} isChecked={filters.includes('html')}  />
        <FilterCheckbox display="CSS" val="css" filterChange={filterChange} isChecked={filters.includes('css')} />
        <FilterCheckbox display="JavaScript" val="javascript" filterChange={filterChange} isChecked={filters.includes('javascript')} />
      </form>
    )
  }
}
