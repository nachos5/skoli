import React from 'react';
import PropTypes from 'prop-types';

export default function Field(props) {
  const { label, name, type, placeholder, checked, onChange, noInput, value } = props;

  if (noInput)
    return (
      <div className="col-6 d-flex">
        <label className="col-4">{label}</label>
        <p className="col-8 pl-0">{name}</p>
      </div>
    );

  if (checked === undefined || checked === null || checked === '')
    return (
      <div className="col-6 d-flex">
        <label className="col-4">{label}</label>
        {(value) ? (
          <input className="col-8" type={type} name={name} defaultValue={value} placeholder={placeholder} />
        ) : (
          <input className="col-8" type={type} name={name} placeholder={placeholder} />
        )}
      </div>
    );

  return (
    <div className="col-6 d-flex">
      <label className="col-4">{label}</label>
      <div className="col-8 pl-0 ml-0">
        <input type={type} name={name} placeholder={placeholder} checked={checked} onChange={onChange} />
      </div>
    </div>
  );  
}

Field.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  noInput: PropTypes.bool,
  value: PropTypes.string,
}
