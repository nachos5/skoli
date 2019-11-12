import React, { Component } from 'react'

import { toggleLectureFinish } from '../../api';

export default class Klara extends Component {
  constructor(props) {
    super(props)
    this.state = {
      klaradur: this.props.klaradur
    }
    this.clickHandler = this.clickHandler.bind(this);
  }
  

  clickHandler(e) {
    const { slug } = this.props;
    toggleLectureFinish(slug);
    this.setState({ klaradur: !this.state.klaradur })
  }

  render() {
    const { klaradur } = this.state;

    return (
      <div className="col-12 d-flex justify-content-center">
      {(!klaradur) ? (
        <button type="button" className="btn btn-outline-primary" onClick={this.clickHandler}>
          Klára fyrirlestur
        </button>
      ) : (
        <button type="button" className="btn btn-success" onClick={this.clickHandler}>
          Fyrirlesturinn er kláraður
        </button>
      )}
      </div>
    )
  }
}