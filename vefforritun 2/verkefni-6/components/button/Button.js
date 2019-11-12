import React from 'react';
import PropTypes from 'prop-types';

import scss from './Button.scss'; // eslint-disable-line

export default function Button(props) {
  const { active, children, onClick } = props;

  return (    
    <button className={active ? "btn btn-success" : "btn btn-outline-primary"} onClick={onClick}>
      {children}
    </button>
  );
}

Button.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.any,
  onClick: PropTypes.func,
}

Error.propTypes = {
  onClick: PropTypes.func,
};
