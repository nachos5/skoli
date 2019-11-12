import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Layout from '../components/layout/Layout';
import Todos from '../components/todos/Todos';
import Button from '../components/button/Button';
import TodoCreate from '../components/todo-create/TodoCreate';

import { getTodos, updateTodo, addTodo } from '../api';

function Home(props) {
  const { initialTodos } = props;

  const [data, setData] = useState(initialTodos);
  const [loading, setLoading] = useState(false);
  const [updatedId, setUpdatedId] = useState(null);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [errorState, setErrorState] = useState(null);


  async function filter() {
    setLoading(true);
    setHideCompleted(!hideCompleted);
    setData(await getTodos(!hideCompleted));
    setLoading(false);
  }

  async function changeTodoStatus(id, currStatus) {
    setLoading(true);

    const { json, errors } = await updateTodo(id, { completed: !currStatus });
    if (errors) setErrorState(json);
    else setErrorState(null);

    setData(await getTodos(hideCompleted));
    setUpdatedId(id);
    setLoading(false);
  }

  async function createTodo(target) {
    setLoading(true);

    const title = target.title.value;
    const due = target.due.value;
    const { json, errors } = await addTodo(title, due);
    if (errors) setErrorState(json);
    else setErrorState(null);

    setData(await getTodos(hideCompleted));
    setLoading(false);
  }

  return (
    <Layout title="Verkefni">

      <div className="mt-2 mb-4">
        {(!hideCompleted) ? (
          <Button active={false} onClick={filter}>
            Fela kláruð verkefni
          </Button>
        ) : (
          <Button active={true} onClick={filter}>
            Sýna kláruð verkefni
          </Button>
        )}
      </div>

      <Todos
        loading={loading}
        updatedId={updatedId}
        todos={data}
        changeTodoStatus={changeTodoStatus} />
      
      <h3 className="mt-5 mb-3">Nýtt verkefni</h3>

      <TodoCreate loading={loading} createTodo={createTodo} errors={errorState} />  

    </Layout>
  );
}

Home.getInitialProps = async ({ req }) => { // eslint-disable-line
  const initialTodos = await getTodos();

  return { initialTodos };
}

Home.propTypes = {
  initialTodos: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
}

export default Home
