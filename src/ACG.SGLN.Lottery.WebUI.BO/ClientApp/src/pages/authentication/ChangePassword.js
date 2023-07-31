import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Spinner,
} from 'reactstrap';
//react-redux
import { useSelector, useDispatch } from 'react-redux';
// react-router-dom
import { withRouter, Link } from 'react-router-dom';

// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';
// reduxform
import { reduxForm, Field } from 'redux-form';
import { renderTextField } from '../../components/common/RenderTextField';
// actions
import { changePassword } from '../../store/actions';
// import images
import profile from '../../assets/images/profile-img.png';
import logo from '../../assets/images/logo-sm-light.png';
//constants
import { TRANSLATE, PASSWORD_REGEX } from "../../constants";

const ChangePassword = (props) => {
  const dispatch = useDispatch();

  // handleValidSubmit
  function handleValidSubmit(formData) {
    dispatch(changePassword(formData));
  }
  /*------handling api data---------*/
  const nextProps = useSelector((state) => ({
    changePasswordSuccess: state.Users.changePasswordSuccess,
  }));
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (nextProps.changePasswordSuccess) {
      props.history.push('/dashboard');
      props.reset();
    }
  }, [nextProps.changePasswordSuccess, props]);

  const { handleSubmit, pristine, submitting } = props;
  return (
    <React.Fragment>
      <div className='account-pages my-5 pt-sm-5'>
        <Container className="mt-5">
          <Row className='justify-content-center'>
            <Col md={8} lg={6} xl={5}>
              <Card className='overflow-hidden'>
                <div className='custom-color'>
                  <Row>
                    <Col className='col-7'>
                      <div className='custom-text-color p-4'>
                        <h5 className='custom-text-color'>{TRANSLATE.t('CHANGE_PASSWORD.CHANGE_PASSWORD_MESSAGE')}</h5>
                      </div>
                    </Col>
                    <Col className='col-5 align-self-end'>
                      <img src={profile} alt='' className='img-fluid' />
                    </Col>
                  </Row>
                </div>
                <CardBody className='pt-0'>
                  <div>
                    <Link to='/'>
                      <div className='avatar-md profile-user-wid mb-4'>
                        <span className='avatar-title rounded-circle bg-light'>
                          <img
                            src={logo}
                            alt='Logo'
                            className='rounded-circle'
                            height='50'
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className='p-2'>
                    <AvForm
                      className='form-horizontal'
                      noValidate
                      onSubmit={handleSubmit(handleValidSubmit)}
                    >
                      <div className='form-group'>
                        <AvField
                          name='currentPassword'
                          tag={Field}
                          component={renderTextField}
                          label= {TRANSLATE.t('CHANGE_PASSWORD.CURRENT_PASSWORD')}
                          className='form-control'
                          placeholder= {TRANSLATE.t('CHANGE_PASSWORD.ENTER_CURRENT_PASSWORD')}
                          type='text'
                          validate={{
                            required: {value: true, errorMessage: TRANSLATE.t('ERRORS.REQUIRED')},
                            pattern: {
                              value: [PASSWORD_REGEX],
                              errorMessage: TRANSLATE.t('ERRORS.PASSWORD_VALIDATION')
                            }
                          }}
                        />
                      </div>

                      <div className='form-group'>
                        <AvField
                          name='newPassword'
                          tag={Field}
                          component={renderTextField}
                          label= {TRANSLATE.t('CHANGE_PASSWORD.NEW_PASSWORD')}
                          type='text'
                          placeholder= {TRANSLATE.t('CHANGE_PASSWORD.ENTER_NEW_PASSWORD')}
                          validate={{
                            required: {value: true, errorMessage: TRANSLATE.t('ERRORS.REQUIRED')},
                            pattern: {
                              value: [PASSWORD_REGEX],
                              errorMessage: TRANSLATE.t('ERRORS.PASSWORD_VALIDATION')
                            }
                          }}
                        />
                      </div>
                      <div className='mt-3'>
                        <button
                          className='btn btn-primary btn-block waves-effect waves-light'
                          type='submit'
                          disabled={pristine || submitting}
                        >
                          {TRANSLATE.t('SUBMIT')}
                          {nextProps.isAuthenticating && (
                            <Spinner className='mx-2' size='sm' />
                          )}
                        </button>
                      </div>
                    </AvForm>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

ChangePassword.propTypes = {
  history: PropTypes.object.isRequired,
  reset: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default withRouter(
  reduxForm({
    form: 'ChangePassword',
  })(ChangePassword)
);
