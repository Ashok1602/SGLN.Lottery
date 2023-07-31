import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
//react-redux
import { useSelector, useDispatch } from 'react-redux';
import { createUser, updateUser } from '../../store/actions';
// reduxform
import { reduxForm, Field } from 'redux-form';
import {
  renderTextField,
  renderSelectField,
} from '../../components/common/RenderTextField';
// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';
//constants
import { TRANSLATE } from '../../constants';
import { Row, Col, CardBody, Container, Modal, Label } from 'reactstrap';
import { renderOptions, getListOfRoles, getDirectionTypes } from '../../helpers';

const AddUser = (props) => {
  const { title, apiType, callApi } = props;
  const [roleName, updateRole] = React.useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
  if (props.initialValues && props.initialValues.roleName) {
    updateRole(props.initialValues.roleName);
  }
  },[props.initialValues])

  const requestNatureData=getDirectionTypes();

  //for toggle modal
  const toggle = () => {
    props.handleModal();
  };
  //for submit form
  function onSubmit(formData) {
    formData.requiredKeys = {
      firstName: TRANSLATE.t('USERS.FIRST_NAME'),
      lastName: TRANSLATE.t('USERS.LAST_NAME'),
      Email: "E-mail",
      phoneNumber: TRANSLATE.t('USERS.PHONE_NUMBER'),
      roleName: TRANSLATE.t('USERS.ENTER_ROLE_NAME')
    };
    if (formData.id) {
      const { id, firstName, lastName, phoneNumber, roleName, administration } = formData;
      dispatch(updateUser({ id, firstName, lastName, phoneNumber, roleName, administration }));
    } else {
      dispatch(createUser(formData));
    }
  }

  /*------handling api data---------*/
  const nextProps = useSelector((state) => ({
    data: state.Users.updateData,
    roleData: state.Role.data,
  }));
  const mount = useRef(() => {
    toggle();
    callApi(apiType);
  });
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (nextProps.data) {
      mount.current();
    }
  }, [nextProps.data]);

  const { handleSubmit } = props;
  // console.log(getListOfRoles(), props.initialValues);
  return (
    <div>
      <Modal
        className='account-pages my-5 pt-sm-5'
        isOpen={props.isOpen}
        toggle={toggle}
        size='lg'
      >
        <Container>
          <Row className='justify-content-center'>
            <Col style={{ padding: '0' }}>
              <AvForm
                className='form-horizontal'
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className='bg-soft-primary'>
                  <Row>
                    <Col>
                      <div className='modal-header bg-soft-primary'>
                        <i
                          className={'bx bx-user-circle mr-3 ml-1'}
                          style={{ fontSize: '25px' }}
                        ></i>
                        <h5 className='mt-auto text-white'>{title}</h5>
                        <button
                          type='button'
                          className='close'
                          data-dismiss='modal'
                          onClick={toggle}
                        >
                          <span aria-hidden='true' className='close-button'>
                            &times;
                          </span>
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody>
                  <Row>
                    <Col lg={6}>
                      <div className='form-group'>
                        <AvField
                          name='firstName'
                          tag={Field}
                          component={renderTextField}
                          label={TRANSLATE.t('USERS.FIRST_NAME')}
                          className='form-control'
                          placeholder={TRANSLATE.t('USERS.ENTER_FIRST_NAME')}
                          type='text'
                          validate={{
                            required: {value: props.isUpdateEvent ? false : true, errorMessage: TRANSLATE.t('ERRORS.REQUIRED')},
                          }}
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className='form-group'>
                        <AvField
                          name='lastName'
                          tag={Field}
                          component={renderTextField}
                          label={TRANSLATE.t('USERS.LAST_NAME')}
                          className='form-control'
                          placeholder={TRANSLATE.t('USERS.ENTER_LAST_NAME')}
                          type='text'
                          validate={{
                            required: {value: props.isUpdateEvent ? false : true, errorMessage: TRANSLATE.t('ERRORS.REQUIRED')},
                          }}
                        />
                      </div>
                    </Col>
                  </Row>

                  {!props.isUpdateEvent && (
                    <div className='form-group'>
                      <AvField
                        name='Email'
                        tag={Field}
                        component={renderTextField}
                        label='E-mail'
                        className='form-control'
                        placeholder={TRANSLATE.t('ENTER_EMAIL')}
                        type='email'
                        validate={{
                          required: {value: props.isUpdateEvent ? false : true, errorMessage: TRANSLATE.t('ERRORS.REQUIRED')},
                        }}
                      />
                    </div>
                  )}
                  <Row>
                    <Col lg={6}>
                      <div className='form-group'>
                        <AvField
                          name='phoneNumber'
                          tag={Field}
                          component={renderTextField}
                          label={TRANSLATE.t('USERS.PHONE_NUMBER')}
                          className='form-control'
                          placeholder={TRANSLATE.t('USERS.ENTER_PHONE_NUMBER')}
                          type='text'
                          validate={{
                            required: {value: props.isUpdateEvent ? false : true, errorMessage: TRANSLATE.t('ERRORS.REQUIRED')},
                          }}
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                    <Label>{TRANSLATE.t('USERS.ROLE_NAME')}</Label>
                      <div className='form-group'>
                        <Field
                          name='roleName'
                          component={renderSelectField}
                          className='form-control'
                          placeholder={TRANSLATE.t('USERS.ENTER_ROLE_NAME')}
                          onChange={e => updateRole(e.target.value)}
                          options={
                              renderOptions(getListOfRoles(), "label", "value")
                          }
                        />
                      </div>
                    </Col>
                    {roleName === 'InternalAgents' ?
                    <Col lg={6}>
                    <Label>{TRANSLATE.t('DIRECTION_TYPE')}</Label>
                      <div className='form-group'>
                        <Field
                          name='administration'
                          component={renderSelectField}
                          className='form-control'
                          placeholder={TRANSLATE.t('DIRECTION_TYPE')}
                          options={
                              renderOptions(requestNatureData, "label", "value")
                          }
                        />
                      </div>
                    </Col> : ""}
                  </Row>

                  {/* {!props.isUpdateEvent && (
                    <div className='form-group'>
                      <AvField
                        name='password'
                        tag={Field}
                        component={renderTextField}
                        label={TRANSLATE.t('LOGIN.PASSWORD')}
                        className='form-control'
                        placeholder={TRANSLATE.t('USERS.ENTER_PASSWORD')}
                        type='text'
                        validate={{
                          required: {
                            value: true,
                            errorMessage: TRANSLATE.t('ERRORS.REQUIRED'),
                          },
                          pattern: {
                            value:[USER_PASSWORD_REGEX],
                            errorMessage:
                              'min six characters, least a number, and at least a special character',
                          },
                        }}
                      />
                    </div>
                  )} */}
                </CardBody>
                <div className='modal-footer'>
                  <button
                    className='btn btn-primary  waves-effect waves-light'
                    type='submit'
                    // disabled={pristine || submitting}
                  >
                    {TRANSLATE.t('ANNOUNCEMENT.SUBMIT')}
                  </button>
                  &ensp;
                  <button
                    className='btn btn-secondary  waves-effect waves-light'
                    type='submit'
                    onClick={toggle}
                  >
                    {TRANSLATE.t('ANNOUNCEMENT.BACK')}
                  </button>
                </div>
              </AvForm>
            </Col>
          </Row>
        </Container>
      </Modal>
    </div>
  );
};

AddUser.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  callApi: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  apiType: PropTypes.string.isRequired,
  isUpdateEvent: PropTypes.bool.isRequired,
  initialValues: PropTypes.object
};
export default reduxForm({
  form: 'AddUser',
})(AddUser);
