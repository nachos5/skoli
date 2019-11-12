import React, { useState, useEffect } from 'react';
import queryString from 'query-string';

// Api
import { getProductsByCategoryId, getProductCount, getProductsByCatgegoryIdPages } from '../../api';
import { IProduct, IError } from '../../api/types';
// Components
import Products from '../../components/products/Products';
import Spinner from '../../components/spinner/Spinner';
import Search from '../../components/search/Search';
// Routes
import NotFound from '../system-pages/NotFound';
// ./
import './Category.scss';

export default function Category(props: any) {
  const { history, location, match } = props;
  const query = queryString.parse(location.search);
  const { id } = match.params;

  // Data
  const [products, setProducts] = useState<IProduct[]>([] as IProduct[]);
  const [totalCount, setTotalCount] = useState(0);
  const [currCount, setCurrCount] = useState(0);
  // Parameter
  const [page, setPage] = useState(parseInt(query.page as string, 10) || 0);
  const [search, setSearch] = useState(query.search as string);
  // Different states
  const [loading, setLoading] = useState(true);
  const [partialLoading, setPartialLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [error, setError] = useState<IError[]>([]);

  /**
   * Set initial state and update on href changes
   * search query - page and search
   */
  useEffect(() => {
    fetchData(id);
  }, [history.location]);

  /**
   * Get data for products by id, page number and search string
   * Load for the first time or load addition pages of products
   * and load corresponding category and number of products in that
   * category
   * 
   * @param id - category id
   */
  async function fetchData(id: number) {
    setLoading(true);

    // First load of pages
    if (currCount === 0) {
      await getProductsByCatgegoryIdPages(id, page, search)
        .then((result) => {
          // Error
          if (!result.isOk) {
            if (history.location.search !== '') {
              setCurrCount(0);
              setNoResult(true);
            }
            else setError(result.data);
          }
          else {
            setProducts(result.data);
            setCurrCount(result.data.length);
          }
        })
    }
    // Load more products
    else {
      await getProductsByCategoryId(id, page, search)
        .then((result) => {
          // Error
          if (!result.isOk) {
            if (history.location.search !== '') {
              setCurrCount(0);
              setNoResult(true);
            }
            else setError(result.data);
          }
          else {
            // Searching
            if (page === 0) {
              setProducts(result.data);
              setCurrCount(result.data.length);
            } 
            // Show more button
            else {
              const currProducts = products;
              currProducts.push(...result.data);
              setProducts(currProducts);
              setCurrCount(currProducts.length);
            }
          }
        })
    }

    // Get category on first load and a new search
    await getProductCount(id, search)
    .then((result) => {
      if (!result.isOk) {
        if (history.location.search !== '') {
          setCurrCount(0);
          setNoResult(true);
        }
        else setError(result.data);
      }
      else setTotalCount(result.data.count);
    })
    setLoading(false);
  }

  /**
   * Load additional products
   */
  async function appendProducts() {
    setPartialLoading(true);

    history.push(`/categories/${id}?page=${page + 1}${search ? `&search=${search}` : ''}`);
    setPage(page + 1)

    setPartialLoading(false);
  }

  /**
   * Search for products that match the query
   * @param query - search string
   */
  async function handleSearch(query: string) {
    setNoResult(false);
    setSearch(query);
    setPage(0);
    history.push(`/categories/${id}?page=${0}&search=${query}`)
  }

  if (error.length > 0) return <NotFound/>

  return (
    <>
      {loading ? <Spinner /> : null}
      <div className={loading ? 'category category__blur' : 'category'}>
        <h1 className="text-center">{products[0] ? products[0].name : null}</h1>
        <Search search={handleSearch} />

        {(noResult) ? (
          <h2 className="text-center">Engar niðurstöður</h2>
        ) : (
          <Products products={products} />
        )}

        {!loading ? (
        <div className="col-12 d-flex flex-column align-items-center justify-content-center">
          {!noResult ? (
            <p>Sýni {currCount} af {totalCount} vörum</p>
          ) : null}
          {(currCount < totalCount && !noResult) ? (
            <button className="btn btn-outline-primary" disabled={partialLoading} onClick={() => appendProducts()}>
              Hlaða inn fleiri vörum
            </button> 
          ) : null}
        </div>
        ) : null}

        {(partialLoading) ? <Spinner /> : null}

      </div>
    </>  
  )
}
