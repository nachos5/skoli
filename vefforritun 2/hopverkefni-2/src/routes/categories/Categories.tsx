import React, { useState, useEffect } from 'react';

// Api
import { getCategories } from '../../api/index';
import { ICategory, IError } from '../../api/types';
// Components
import Categories from '../../components/categories/Categories';
import Spinner from '../../components/spinner/Spinner';
// Routes
import NotFound from '../system-pages/NotFound';

export default function CategoriesRoute() {
  // Data
  const [categories, setCategories] = useState<ICategory[]>([]);
  // Different states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<IError[]>([]);

  /**
   * Initial state
   */
  useEffect(() => {
    const fetch = async () => {
      await getCategories()
        .then((result) => {
          if (!result.isOk) setError(result.data);
          else setCategories(result.data);
        })
      setLoading(false);
    }
    fetch();
  })

  if (error.length > 0) return <NotFound/>
  if (loading) return <Spinner />

  return (
    <Categories categories={categories} />
  );
}
