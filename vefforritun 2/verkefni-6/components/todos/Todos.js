import React from 'react';
import PropTypes from 'prop-types';

import TodoItem from '../todo-item/TodoItem';
import Spinner from '../spinner/Spinner';

// Listi af verkefnum á forsíðu
export default function Todos(props) {
  const { loading, updatedId, todos, changeTodoStatus } = props;

  return (
    <React.Fragment>
      <div>

        {(loading) ? (
          <Spinner />
        ) : (null)}

        {(todos.length > 1) ? (       
          <div>
            {todos.map((todo, i) => {
              return <TodoItem 
                        key={i}
                        loading={loading}
                        updatedId={updatedId}
                        todo={todo} 
                        changeTodoStatus={changeTodoStatus} />
            })} 
          </div>
        ) : (
          <TodoItem
            loading={loading}
            updatedId={updatedId}
            todo={todos} 
            changeTodoStatus={changeTodoStatus} />
        )}

      </div>
    </React.Fragment>
  );
}

Todos.propTypes = {
  loading: PropTypes.bool,
  updatedId: PropTypes.number,
  todos: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  changeTodoStatus: PropTypes.func,
}
