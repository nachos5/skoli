import React from 'react'
import PropTypes from 'prop-types'
import './Lecture.scss'

import TilBaka from './TilBaka'
import Quote from './Quote'
import List from './List'
import Image from './Image'
import Youtube from './Youtube'
import Klara from './Klara';

export default class Lecture extends React.Component {

  static propTypes = {
    lecture: PropTypes.object,
  }
  
  render() {
    const { lecture, klaradur } = this.props;

    return (
      <div className="container mb-5">

      <TilBaka />

        <div className="row d-flex flex-column">
        {lecture.content.map((c, i) => {
          return (c.type === 'text') ? (
            <p key={i} className="texti">
              {c.data}
            </p>

          ) : (c.type === 'quote') ? (
            <Quote key={i} content={c} />

          ) : (c.type === 'heading') ? (
            <h3 key={i} className="mt-5">
              {c.data}
            </h3>

          ) : (c.type === 'code') ? (
            <code key={i}>
              {c.data}
            </code>

          ) : (c.type === 'list') ? (
            <List key={i} content={c} />

          ) : (c.type === 'image') ? (
            <Image key={i} content={c} />

          ) : (c.type === 'youtube') ? (
            <Youtube key={i} content={c} />

          ) : (null)
        })}
        </div>

        <Klara slug={lecture.slug} klaradur={klaradur} />

      </div>
    );
  }
}