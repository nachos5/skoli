import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'
import './TodoItem.scss';

// Verkefni í lista á forsíðu
export default function todoItem(props) {
  const { loading, updatedId, todo, changeTodoStatus } = props;

  function handleInputChange() {
    changeTodoStatus(todo.id, todo.completed);
  }

  return (
    <div className="col-12 pt-2 pb-2 pl-0 d-flex flex-row">

      <input
        name={todo.title}
        type="checkbox"
        checked={todo.completed}
        onChange={handleInputChange} 
        disabled={loading} />

      <Link prefetch href={`/${todo.id}`}>
        <a className="mb-auto mt-auto">
          {todo.title}
        </a>
      </Link>

      {(todo.due) ? (
        <small className="mb-auto mt-auto ml-2">
          Klára fyrir: {todo.due}
        </small>
      ) : (null)}

      {(todo.id === updatedId) ? (
        <p className="text-success mb-auto mt-auto ml-2">
          Verkefnið var uppfært!
        </p>
      ) : (null)}

    </div>
  );
}

todoItem.propTypes = {
  loading: PropTypes.bool,
  updatedId: PropTypes.number,
  todo: PropTypes.object,
  changeTodoStatus: PropTypes.func,
}