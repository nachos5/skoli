import React, { Component } from 'react';
import Helmet from 'react-helmet';

import { getLectureList } from '../../api';

import Header from '../../components/header/Header';
import Filters from '../../components/filters/Filters';
import Lectures from '../../components/lectures/Lectures';

export default class Home extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      loading: true,
      error: false,
      lectures: [],
      filters: []
    }

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.updateLectures = this.updateLectures.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.updateLectures();
  }

  updateLectures() {
    try {
      // sækjum fyrirlestra
      this.setState({ lectures: getLectureList(this.state.filters)})
    } catch (e) {
      // eitthvað fór úrskeiðis
      console.error(e);
      this.setState({ error: true });
    }
    this.setState({ loading: false });
  }

  // það sem gerist þegar filterar breytast
  handleFilterChange(value) {
    this.setState({ loading: true });
    const { filters } = this.state;
    // ef gildi í filters þá fjarlægjum við það, annars bætum því við
    if (filters.includes(value)) {
      const i = filters.indexOf(value);
      filters.splice(i, 1);
    } else {
      filters.push(value);
    }
    // uppfærum
    this.setState({ filters });
    this.updateLectures();
  }

  render() {
    const { loading, error } = this.state;

    if (loading) {
      return (
        <React.Fragment>
          <Header category="Vefforritun" title="Fyrirlestrar" image="img/header.jpg" />
          <h1 className="w-100 text-center">Hleður...</h1>
        </React.Fragment>
      )
    }

    if (error) {
      return (
        <React.Fragment>
          <Header category="Vefforritun" title="Fyrirlestrar" image="img/header.jpg" />
          <h1 className="w-100 text-center">Villa!</h1>
        </React.Fragment>
      )
    }

    const { lectures, filters } = this.state;
    return (
      <React.Fragment>
        <Helmet title="Fyrirlestrar" />
        <Header category="Vefforritun" title="Fyrirlestrar" image="img/header.jpg" />
        <Filters filterChange={this.handleFilterChange} filters={filters} />
        <Lectures lectures={lectures} />
      </React.Fragment>
    );
  }
}
