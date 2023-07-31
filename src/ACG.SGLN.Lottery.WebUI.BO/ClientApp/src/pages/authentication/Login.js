import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
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
import { loginUser } from '../../store/actions';
//constants
import {TRANSLATE, PASSWORD_REGEX} from "../../constants";
// import images
import profile from '../../assets/images/profile-img.png';
import logo from '../../assets/images/logo-sm-light.png';

const Login = (props) => {
  const dispatch = useDispatch();

  // handleValidSubmit
  function handleValidSubmit(formData) {
    dispatch(loginUser(formData));
  }
  /*------handling api data---------*/
  const nextProps = useSelector((state) => ({
    loginData: state.Login.loginData,
    isAuthenticating: state.Login.isAuthenticating,
  }));

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (nextProps.loginData) {
      if (nextProps.loginData.accessToken) {
        if (nextProps.loginData.isTemporaryPassword) {
          props.history.push('/change-password');
        } else {
          props.history.push('/dashboard');
        }
        window.location.reload();
      }
    }
  }, [nextProps.loginData, props.history]);

  const { handleSubmit, pristine, submitting } = props;
  return (
    <React.Fragment>
      <div className='account-pages my-5 pt-sm-5'>
        <Container>
          <Row className='justify-content-center'>
            <Col md={8} lg={6} xl={5}>
              <Card className='overflow-hidden'>
                <div className='custom-color'>
                  <Row>
                    <Col className='col-7'>
                      <div className='custom-text-color font-weight-bold p-4'>
                        {/* <h5 className='text-primary'>{TRANSLATE.t('LOGIN.WELCOME')}</h5> */}
                        <p>{TRANSLATE.t('LOGIN.SUBTITLE')}</p>
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
                            alt='logo'
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
                      {props.error && props.error ? (
                        <Alert color='danger'>{props.error}</Alert>
                      ) : null}

                      <div className='form-group'>
                        <AvField
                          name='userName'
                          tag={Field}
                          component={renderTextField}
                          label={TRANSLATE.t('LOGIN.USERNAME')}
                          className='form-control'
                          placeholder={TRANSLATE.t('LOGIN.USERNAMEPH')}
                          type='text'
                          validate={{
                            required: {value: true, errorMessage: TRANSLATE.t('ERRORS.REQUIRED')}
                          }}
                        />
                      </div>

                      <div className='form-group'>
                        <AvField
                          name='password'
                          tag={Field}
                          component={renderTextField}
                          label={TRANSLATE.t('LOGIN.PASSWORD')}
                          type='password'
                          required
                          placeholder={TRANSLATE.t('LOGIN.PASSWORDPH')}
                          validate={{
                            required: {value: true, errorMessage: TRANSLATE.t('ERRORS.REQUIRED')},
                            pattern: {
                              value: [PASSWORD_REGEX],
                              errorMessage: TRANSLATE.t('ERRORS.PASSWORD_VALIDATION')
                            }
                          }}
                        />
                      </div>

                      {/* <div className='custom-control custom-checkbox'>
                        <input
                          type='checkbox'
                          className='custom-control-input'
                          id='customControlInline'
                        />
                        <label
                          className='custom-control-label'
                          htmlFor='customControlInline'
                        >
                          {TRANSLATE.t('LOGIN.REMEMBER')}
                        </label>
                      </div> */}

                      <div className='mt-3'>
                        <button
                          className='btn btn-primary btn-block waves-effect waves-light'
                          type='submit'
                          disabled={pristine || submitting}
                        >
                          {TRANSLATE.t('LOGIN.SUBMIT')}
                          {nextProps.isAuthenticating && (
                            <Spinner className='mx-2' size='sm' />
                          )}
                        </button>
                      </div>

                      <div className='mt-4 text-center'>
                        <Link to='/forgot-password' className="font-weight-medium custom-text-color">
                          <i className='mdi mdi-lock mr-1'></i> {TRANSLATE.t('LOGIN.FORGOTPSWD')}
                        </Link>
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

Login.propTypes = {
  loginUser: PropTypes.func,
  history: PropTypes.object.isRequired,
  error: PropTypes.node,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default withRouter(
  reduxForm({
    form: 'LoginPage',
  })(Login)
);
