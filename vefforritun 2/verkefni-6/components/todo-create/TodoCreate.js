import React from 'react';
import PropTypes from 'prop-types';

import Form from '../form/Form';
import Field from '../field/Field';

// Stakt verkefni á /:id
export default function todoCreate(props) {
  const { loading, createTodo, errors } = props;

  return (
    <Form errors={errors} callback={createTodo} >
      <Field label="Titill:" name="title" type="text" placeholder="" />
      <Field label="Klárist fyrir:" name="due" type="text" placeholder="YYYY-MM-DD hh:mm:ss"></Field>
      <input className="col-4 pl-0 mt-3 btn btn-primary" type="submit" value="Búa til verkefni" disabled={loading} />      
    </Form>
  );
}

todoCreate.propTypes = {
  loading: PropTypes.bool,
  createTodo: PropTypes.func,
  errors: PropTypes.array,
}