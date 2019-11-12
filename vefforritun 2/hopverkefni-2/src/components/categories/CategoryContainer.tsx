import React from 'react';
import { Link } from 'react-router-dom';

// Api
import { ICategory } from '../../api/types';
// ./
import './CategoryContainer.scss';

interface Props {
  category: ICategory
}

export default function CategoryContainer(props: Props) {
  const { category } = props;

  return (
    <div className="col-12 col-md-6 col-lg-4 category-container-outer">
      <Link className="col-12 category-container-inner" to={"/categories/" + category.id}>
        <p className="category-title">{category.name}</p>
      </Link>
    </div>
  )
}
