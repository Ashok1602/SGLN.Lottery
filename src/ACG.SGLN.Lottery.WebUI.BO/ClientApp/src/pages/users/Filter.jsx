import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Button, Row, Col, Label, FormGroup } from 'reactstrap';
import {
  renderTextField,
  renderSelectField,
} from '../../components/common/RenderTextField';
import CommonCollapse from '../../components/common/Collapse';
//constants
import { TRANSLATE } from '../../constants';
import { renderOptions, getListOfRoles } from '../../helpers';
function Filter(props) {
  const [isOpen, setIsOpen] = useState(false);

  /*---------------on submit---------------*/
  const onSubmit = (formProps) => {
    if (formProps.roles){
      formProps.roles = [formProps.roles];
    }
    props.onFilterSubmit(formProps);
  };

  /*---------------on reset---------------*/
  const onReset = () => {
    props.reset();
    props.onFilterSubmit();
  };
  const { handleSubmit, pristine, submitting } = props;
  return (
    <CommonCollapse
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      title={TRANSLATE.t('FILTER.FILTER')}
      className='mx-4 my-1'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('USERS.FIRST_NAME')}</Label>
              <Field
                name='firstName'
                component={renderTextField}
                type='text'
                maxLength={25}
                autoCapitalize={'true'}
                placeholder={TRANSLATE.t('USERS.FIRST_NAME')}
              />
            </FormGroup>
          </Col>
          <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('USERS.LAST_NAME')}</Label>
              <Field
                name='lastName'
                component={renderTextField}
                type='text'
                maxLength={25}
                autoCapitalize={'true'}
                placeholder={TRANSLATE.t('USERS.LAST_NAME')}
              />
            </FormGroup>
          </Col>
          <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('USERS.USERNAME')}</Label>
              <Field
                name='userName'
                component={renderTextField}
                type='text'
                maxLength={25}
                autoCapitalize={'true'}
                placeholder={TRANSLATE.t('USERS.USERNAME')}
              />
            </FormGroup>
          </Col>
          <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{'Email'}</Label>
              <Field
                name='email'
                component={renderTextField}
                type='text'
                maxLength={25}
                autoCapitalize={'true'}
                placeholder={'Email'}
              />
            </FormGroup>
          </Col>
          <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('ANNOUNCEMENT.TITLE')}</Label>
              <Field
                name='title'
                component={renderTextField}
                type='text'
                maxLength={25}
                autoCapitalize={'true'}
                // validate={validateCard}
                onBlur={(e) =>
                  props.onFilterSubmit({ title: e.target.value }, true)
                }
                placeholder={TRANSLATE.t('ANNOUNCEMENT.TITLE')}
              />
            </FormGroup>
          </Col>
          <Col lg={3}>
            <Label>{TRANSLATE.t('USERS.ROLE_NAME')}</Label>
            <div className='form-group'>
              <Field
                name='roles'
                component={renderSelectField}
                className='form-control'
                placeholder={TRANSLATE.t('USERS.ENTER_ROLE_NAME')}
                // options={
                //   props.rolesData &&
                //   props.rolesData.data &&
                //   props.rolesData.data.length
                //     ? renderOptions(
                //         props.rolesData.data,
                //         'roleName',
                //         'id'
                //       )
                //     : []
                // }
                options={
                  renderOptions(getListOfRoles(), "label", "value")
              }
              />
            </div>
          </Col>
          <Col md={3} className='my-1'>
            <div className=''>
              <Button
                color='primary'
                type='submit'
                className='success-btn px-4 mx-2 mt-2'
                disabled={pristine || submitting}
              >
                {TRANSLATE.t('FILTER.SEARCH')}
              </Button>
              <Button
                color='secondary'
                onClick={onReset}
                className='mt-2'
                // disabled={ submitting}
              >
                {TRANSLATE.t('FILTER.RESET')}
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </CommonCollapse>
  );
}
Filter.propTypes = {
  // nextProps: PropTypes.object.isRequired,
  onFilterSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  rolesData: PropTypes.object.isRequired,
};
export default reduxForm({
  form: 'filter', // a unique identifier for this form
})(Filter);
