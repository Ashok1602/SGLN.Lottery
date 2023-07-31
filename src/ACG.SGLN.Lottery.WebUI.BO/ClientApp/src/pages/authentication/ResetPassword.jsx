import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Spinner,
  Alert,
} from "reactstrap";
//react-redux
import { useSelector, useDispatch } from "react-redux";
// react-router-dom
import { withRouter, Link } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
// reduxform
import { reduxForm, Field } from "redux-form";
import { renderTextField } from "../../components/common/RenderTextField";
// actions
import { resetPassword } from "../../store/actions";
// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo-sm-light.png";
//constants
import { TRANSLATE, PASSWORD_REGEX, EMAIL_REGEX } from "../../constants";
import queryString from "query-string";

const ResetPassword = (props) => {
  const { handleSubmit, pristine, submitting } = props;
  const { code } = queryString.parse(props.location.search);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSamePassword, setIsSamePassword] = useState(true);
  const dispatch = useDispatch();

  // handleValidSubmit
  function handleValidSubmit(formData) {
    formData.code = code;
    dispatch(resetPassword(formData));
  }
  /*------handling api data---------*/
  const nextProps = useSelector((state) => ({
    resetPasswordSuccess: state.Users.resetPasswordSuccess,
  }));
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (nextProps.resetPasswordSuccess) {
      props.history.push("/login");
      props.reset();
    }
  }, [nextProps.resetPasswordSuccess, props]);
  //hanlde password change
  const handlePasswordChange = (isNew, value) => {
    if (isNew) {
      setNewPassword(value.target.value);
    } else {
      setConfirmPassword(value.target.value);
    }
    let { basePassword, refPassword } =
      newPassword.length > confirmPassword.length
        ? { basePassword: newPassword, refPassword: confirmPassword }
        : { basePassword: confirmPassword, refPassword: newPassword };
    if (newPassword && confirmPassword && !basePassword.includes(refPassword)) {
      setIsSamePassword(false);
    } else {
      setIsSamePassword(true);
    }
  };

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="custom-color">
                  <Row>
                    <Col className="col-7">
                      <div className="custom-text-color p-4">
                        <h5 className="custom-text-color">
                          {TRANSLATE.t("RESET_PASSWORD.MESSAGE")}
                        </h5>
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
                    <AvForm
                      className="form-horizontal"
                      noValidate
                      onSubmit={handleSubmit(handleValidSubmit)}
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
                      <div className="form-group">
                        <AvField
                          name="newPassword"
                          tag={Field}
                          component={renderTextField}
                          label={TRANSLATE.t("CHANGE_PASSWORD.NEW_PASSWORD")}
                          type="text"
                          placeholder={TRANSLATE.t(
                            "CHANGE_PASSWORD.ENTER_NEW_PASSWORD"
                          )}
                          onChange={(e) => handlePasswordChange(true, e)}
                          validate={{
                            required: {
                              value: true,
                              errorMessage: TRANSLATE.t("ERRORS.REQUIRED"),
                            },
                            pattern: {
                              value: [PASSWORD_REGEX],
                              errorMessage: TRANSLATE.t(
                                "ERRORS.PASSWORD_VALIDATION"
                              ),
                            },
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <AvField
                          name="confirmPassword"
                          tag={Field}
                          component={renderTextField}
                          label={TRANSLATE.t(
                            "CHANGE_PASSWORD.CONFIRM_PASSWORD"
                          )}
                          type="text"
                          placeholder={TRANSLATE.t(
                            "CHANGE_PASSWORD.ENTER_CONFIRM_PASSWORD"
                          )}
                          onChange={(e) => handlePasswordChange(false, e)}
                          validate={{
                            required: {
                              value: true,
                              errorMessage: TRANSLATE.t("ERRORS.REQUIRED"),
                            },
                            pattern: {
                              value: [PASSWORD_REGEX],
                              errorMessage: TRANSLATE.t(
                                "ERRORS.PASSWORD_VALIDATION"
                              ),
                            },
                          }}
                        />
                      </div>
                      {!isSamePassword && (<Alert color="warning">
                       {TRANSLATE.t("MISMATCH_PASSWORD_ERROR")}
                      </Alert>)}
                      <div className="mt-3">
                        <button
                          className="btn btn-primary btn-block waves-effect waves-light"
                          type="submit"
                          disabled={pristine || submitting || !isSamePassword}
                        >
                          {TRANSLATE.t("SUBMIT")}
                          {nextProps.isAuthenticating && (
                            <Spinner className="mx-2" size="sm" />
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

ResetPassword.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  reset: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default withRouter(
  reduxForm({
    form: "ResetPassword",
  })(ResetPassword)
);
