import React, { Fragment } from 'react';
import { Input, FormFeedback, FormText, FormGroup, Label } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TRANSLATE } from '../../constants';
import { registerLocale } from  "react-datepicker";
import fr from 'date-fns/locale/fr';
registerLocale('fr', fr)

export const renderTextField = ({
  input,
  meta: { touched, error, warning },
  ...custom
}) => (
  <Fragment>
    <Input {...(touched ? { valid: error } : {})} {...input} {...custom} />
    {error && <FormFeedback>{error}</FormFeedback>}
    {!error && warning && <FormText>{warning}</FormText>}
  </Fragment>
);

export const renderDatePicker = ({
  input,
  selectedValue,
  onChange,
  placeholder,
  dateFormat,
  showTimeSelect,
  meta: { touched, error },
  ...custom
}) => (
  <Fragment>
    <DatePicker
      locale="fr"
      placeholderText={placeholder}
      className='form-control'
      // defaultDateFormat={}
      selected={selectedValue}
      onChange={onChange}
      showTimeSelect={showTimeSelect}
      dateFormat={dateFormat ? dateFormat : 'dd/MM/yyyy'}
      {...(touched ? { valid: error } : {})}
      {...input}
      {...custom}
    />
  </Fragment>
);

export const renderSelectField = ({
  options,
  input,
  placeholder,
  meta: { touched, error },
  disabled,
  ...custom
}) => {
  return (
    <FormGroup className='mb-3'>
      <Input
        type='select'
        {...input}
        disabled={disabled}
        {...custom}
        value={input.value}
        className={touched && error ? 'errormsg' : ''}
      >
        {<option value='0'>{placeholder}</option>}
        {options}
      </Input>
      {touched && error && error !== TRANSLATE.t('ERRORS.REQUIRED') && (
        <FormFeedback>{error}</FormFeedback>
      )}
    </FormGroup>
  );
};

export const renderRadioButton = ({
  input,
  label,
  meta: { touched, error, warning },
  ...custom
}) => (
  <FormGroup check>
    <Label check>
      <Input
        {...(touched ? { valid: error } : {})}
        {...input}
        {...custom}
        type='radio'
      />
      {label}
    </Label>

    {error && touched && <span className='text-danger error-msg'>{error}</span>}
    {!error && warning && <FormText>{warning}</FormText>}
  </FormGroup>
);

