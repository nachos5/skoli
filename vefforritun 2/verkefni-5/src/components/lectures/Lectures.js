import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Lectures.scss';

import { isLectureFinished } from '../../api';

export default class Lectures extends React.Component {

  static propTypes = {
    lectures: PropTypes.object
  }

  render() {
    const { lectures } = this.props;

    return (
      <div className="container row d-flex m-auto">
        {lectures.lectures.map((lecture, i) => {

          let litur = 'kassi__grar';
          const klaradur = isLectureFinished(lecture.slug);
          if (klaradur) litur = 'kassi__graenn';

          return <Link to={`${lecture.slug}`} key={i} className="col-6 col-lg-4 col-xl-3 d-flex flex-column kassi">

                    <div className={"w-100 kassi__innri1 " + litur}>
                      {(lecture.thumbnail) ? (
                        <img src={lecture.thumbnail} alt={lecture.slug} className="w-100 h-100" />
                      ) : (null)}
                    </div>

                    <div className={"w-100 kassi__innri2 " + litur}>
                      <p>{lecture.category}</p>
                      <p>{lecture.title}</p>
                    </div>

                    <div className="w-100 kassi__innri3"></div>

                </Link>
        })}
      </div>
    );
  }
}