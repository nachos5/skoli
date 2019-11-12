import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Form from '../form/Form';
import Field from '../field/Field';

// Stakt verkefni á /:id
export default function todoDetail(props) {
  const { loading, todo, updateTodoCallback, deleteTodoCallback, errors } = props;

  const [checked, setChecked] = useState(!todo ? false : todo.completed);
  const [deleteBtn, setDeleteBtn] = useState(false);

  async function updateOrDelete(target) {
    if (!deleteBtn) {
      const title = target.title.value;
      const completed = target.completed.value;
      const due = target.due.value;
      await updateTodoCallback(todo.id, title, completed === 'on', due);
    } else {
      await deleteTodoCallback(todo.id);
    }

    return setDeleteBtn(false);
  }

  async function onChange() {
    setChecked(!checked);
  }

  async function onClick() {
    setDeleteBtn(true);
  }

  return (
    <Form errors={errors} callback={updateOrDelete}>

      <Field label="Titill:" name="title" type="text" value={todo.title} />
      <Field label="Lokið:" name="completed" type="checkbox" checked={checked} onChange={onChange} />
      <Field label="Klárist fyrir:" name="due" type="text" value={todo.due} placeholder='YYYY-MM-DD hh:mm:ss' />
      <Field label="Uppfært:" name={todo.updated} noInput={true} />
      <Field label="Búið til:" name={todo.created} noInput={true} />
      <div className="col-12 d-flex flex-row">
        <input name="update" className="col-4 pl-0 mt-3 btn btn-primary" type="submit" value="Uppfæra" disabled={loading} />
        <div className="col-4"></div>
        <input name="delete" className="col-4 pl-0 mt-3 btn btn-primary" onClick={onClick} type="submit" value="Eyða" disabled={loading} />
      </div>
    </Form>
  );
}

todoDetail.propTypes = {
  loading: PropTypes.boolean,
  todo: PropTypes.object,
  updateTodoCallback: PropTypes.func,
  deleteTodoCallback: PropTypes.func,
  errors: PropTypes.array,
}
