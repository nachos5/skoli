import React from 'react';

// Api
import { ICategory } from '../../api/types';
// ./
import CategoryContainer from './CategoryContainer';

interface Props {
  categories: ICategory[]
}

export default function Categories(props: Props) {
  const { categories } = props;


  return (
    <div className="col-12 d-flex flex-wrap">
      {categories.map((item, i) => {
        return (
          <CategoryContainer key={i} category={item} />
        );
      })}
    </div>
  );
}