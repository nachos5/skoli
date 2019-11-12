import React, { useState, useEffect } from 'react';
import Input from '../input/DelayInput';
import posed from 'react-pose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// ./
import './Search.scss';

const Box = posed.div({
  off: {
    width: '60%',
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 10,
    }
  },
  on: {
    width: '100%',
    transition: {
      type: 'spring',
      stiffness: 40,
      damping: 10,
    }
  }
})

interface Props {
  search: any,
}

export default function Search(props: Props) {
  const { search } = props;
  
  const [hovered, setHovered] = useState(false);

  return (
    <div className="col-10 col-sm-8 col-md-6 col-lg-4 m-auto d-flex justify-content-center pt-2">
      <Box className="search" pose={hovered ? 'on' : 'off'} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <FontAwesomeIcon className="mt-1 mr-2" icon="search"/>
        <Input callback={search} />
      </Box>
    </div>
  );
}
