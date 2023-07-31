import React, {useRef, useEffect} from "react";
import { Row, Col, Alert, Card, CardBody, Container } from "reactstrap";
import PropTypes from "prop-types";
//react-redux
import { useSelector, useDispatch,} from 'react-redux';
// react-router-dom
import { withRouter, Link } from "react-router-dom";
// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
// reduxform
import { reduxForm, Field } from 'redux-form';
import { renderTextField } from '../../components/common/RenderTextField';
// actions
import { forgotPassword } from '../../store/actions';
// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo-sm-light.png";
//constants
import {TRANSLATE, EMAIL_REGEX} from "../../constants";

const ForgetPasswordPage = (props) => {
  const dispatch = useDispatch();

   /*------handling api data---------*/
   const nextProps = useSelector((state) => ({
    forgotPasswordSuccess: state.Users.forgotPasswordSuccess,
  }));

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (nextProps.forgotPasswordSuccess) {
     props.reset();
    }
  }, [nextProps.forgotPasswordSuccess, props]);

  //onsubmit
  function onSubmit(formData) {
    dispatch(forgotPassword(formData.email));
  }
  const { handleSubmit, pristine, submitting } = props;
  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2"></i>
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="custom-color">
                  <Row>
                    <Col className="col-7">
                      <div className="custom-text-color font-weight-bold p-4">
                        <p>{TRANSLATE.t('LOGIN.SUBTITLE')}</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt="Logo"
                            className="rounded-circle"
                            height="50"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    {props.forgetError && props.forgetError ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {props.forgetError}
                      </Alert>
                    ) : null}
                    {props.forgetSuccessMsg ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {props.forgetSuccessMsg}
                      </Alert>
                    ) : null}

                    <AvForm
                      className="form-horizontal mt-4"
                      noValidate
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="form-group">
                        <AvField
                          name="email"
                          tag={Field}
                          component={renderTextField}
                          label="Email"
                          className="form-control"
                          placeholder= {TRANSLATE.t('ENTER_EMAIL')}
                          type="email"
                          validate={{
                            required: {value: true, errorMessage: TRANSLATE.t('ERRORS.REQUIRED')},
                            pattern: {
                              value: EMAIL_REGEX,
                              errorMessage: TRANSLATE.t('ERRORS.EMAIL_INVALID')
                            }
                          }}
                        />
                      </div>
                      <Row className="form-group">
                        <Col className="text-right">
                          <button
                            className="btn btn-primary w-md waves-effect waves-light"
                            type="submit"
                            disabled={pristine || submitting}
                          >
                            {TRANSLATE.t('RESET')}
                          </button>
                        </Col>
                      </Row>
                    </AvForm>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                {TRANSLATE.t('FORGET_PASSWORD.GO_BACK_TO')}
                  <Link to="login" className="font-weight-medium custom-text-color">
                  {TRANSLATE.t('LOGIN.LOGIN')}
                  </Link>{" "}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};


ForgetPasswordPage.propTypes = {
  userForgetPassword: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  forgetError: PropTypes.node,
  forgetSuccessMsg: PropTypes.node,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired
};

export default withRouter(
  reduxForm({
    form: 'ForgotPassword',
  })(ForgetPasswordPage)
);
