import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Error from 'next/error';

import Layout from '../components/layout/Layout';
import TodoDetail from '../components/todo-detail/TodoDetail';
import Spinner from '../components/spinner/Spinner';

import { getTodo, updateTodo, deleteTodo } from '../api';

function Home(props) {
  const { todo } = props;

  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [wasUpdated, setWasUpdated] = useState(null);
  const [wasDeleted, setWasDeleted] = useState(null);

  if (!todo) {
    return <Error statusCode={404} />;
  }

  async function updateTodoCallback(id, title, completed, due) {
    setLoading(true);
    const { json, errors } = await updateTodo(id, { title, completed, due });
    if (errors) {
      setErrorState(json);
      setWasUpdated(false);
    } else {
      setErrorState(null);
      setWasUpdated(true);
    }
    setLoading(false);
  }

  async function deleteTodoCallback(id) {
    setLoading(true);
    const success = await deleteTodo(id);
    if (success) {
      setWasDeleted(true);
    }
    setLoading(false);
  }

  if (wasDeleted) {
    return (
      <Layout title='Færslunni var eytt'>
        <Link prefetch href={`/`}>
          <a className="mb-auto mt-auto">
            Smelltu hér til að fara til baka
          </a>
        </Link>
      </Layout>
    )
  }

  return (
    <Layout title={todo.title}>

      <Link prefetch href={`/`}>
        <a>
          Smelltu hér til að fara til baka
        </a>
      </Link>
      <div className="mt-4"></div>

      <TodoDetail 
        loading={loading} 
        todo={todo} 
        updateTodoCallback={updateTodoCallback} 
        deleteTodoCallback={deleteTodoCallback} 
        errors={errorState} />

        {(wasUpdated) ? (
          <p className="text-success">Uppfærslan tókst!</p>
        ) : (null)}

        {(loading) ? (
          <Spinner />
        ) : (null)}

    </Layout>
  );
}

Home.getInitialProps = async ({ query }) => {
  const { id } = query;
  const todo = await getTodo(id);

  return {
    id,
    todo,
  };
}

Home.propTypes = {
  todo: PropTypes.object,
}

export default Home
