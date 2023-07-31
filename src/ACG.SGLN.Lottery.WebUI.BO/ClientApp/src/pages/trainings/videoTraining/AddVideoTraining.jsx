import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
//react-redux
import { useSelector, useDispatch } from "react-redux";
import { addVideoTraining, editVideoTraining } from "../../../store/actions";
// reduxform
import { reduxForm, Field } from "redux-form";
import {
  renderTextField,
} from "../../../components/common/RenderTextField";
// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
//constants
import { TRANSLATE } from "../../../constants";
import { Row, Col, CardBody, Container, Modal } from "reactstrap";

const AddVideoTraining = (props) => {
  const { title, apiType, callApi, eventType, initialValues } =
    props;
  // const [selectedModule] = useState(
  //   initialValues?.moduleId
  //     ? modulesList.filter((data) => data.value === initialValues?.moduleId)
  //     : []
  // );
  const dispatch = useDispatch();

  //for toggle modal
  const toggle = () => {
    props.handleModal();
  };
  /*------handling api data---------*/
  const nextProps = useSelector((state) => ({
    strippedModules: state.TrainingModule.data,
    data: state.Trainings.addVideoTrainingData,
    dataById: state.Trainings.editVideoTrainingData,
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

  const dataByIdmount = useRef(() => {
    toggle();
    callApi(apiType);
  });
  const isDataById = useRef(true);
  useEffect(() => {
    if (isDataById.current) {
      isDataById.current = false;
      return;
    }
    if (nextProps.dataById) {
      dataByIdmount.current();
    }
  }, [nextProps.dataById]);

  //for submit form
  function onSubmit(formData) {
    if (initialValues) {
      dispatch(editVideoTraining(formData));
    } else {
      formData.requiredKeys = {
        title: TRANSLATE.t('ANNOUNCEMENT.TITLE'),
        courseURI: TRANSLATE.t('TRAININGS.COURSE_URI')
      };
      dispatch(addVideoTraining(formData));
    }
  }

  const { handleSubmit } = props;
  return (
    <div>
      <Modal
        className="account-pages my-5 pt-sm-5"
        isOpen={props.isOpen}
        toggle={toggle}
      >
        <Container>
          <Row className="justify-content-center">
            <Col style={{ padding: "0" }}>
              <AvForm
                className="form-horizontal"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="bg-soft-primary">
                  <Row>
                    <Col>
                      <div className="modal-header bg-soft-primary">
                        <i
                          className={"bx bx-video mr-3 ml-1"}
                          style={{ fontSize: "25px" }}
                        ></i>
                        <h5 className="mt-auto text-white">{title}</h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          onClick={toggle}
                        >
                          <span
                            aria-hidden="true"
                            className="close-button text-white"
                          >
                            &times;
                          </span>
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody>
                  {/* <div className="form-group">
                    <Label>{TRANSLATE.t("TRAININGS.CHOOSE_MODULES")}</Label>
                    <Field
                      name="moduleId"
                      component={renderSelectField}
                      className="form-control"
                      placeholder={
                        selectedModule[0]?.label ||
                        TRANSLATE.t("TRAININGS.CHOOSE_MODULES")
                      }
                      disabled = {eventType === "view" ? true : false}
                      options={
                        modulesList && modulesList.length
                          ? renderOptions(modulesList, "label", "value")
                          : []
                      }
                    />
                  </div> */}
                  <div className="form-group">
                    <AvField
                      name="title"
                      tag={Field}
                      component={renderTextField}
                      label={TRANSLATE.t("ANNOUNCEMENT.TITLE")}
                      className="form-control"
                      placeholder={TRANSLATE.t("ANNOUNCEMENT.ENTER_TITLE")}
                      type="text"
                      disabled = {eventType === "view" ? true : false}
                      validate={
                        !props.initialValues
                          ? {
                              required: {
                                value: true,
                                errorMessage: TRANSLATE.t("ERRORS.REQUIRED"),
                              },
                            }
                          : {}
                      }
                    />
                  </div>
                  <div className="form-group">
                    <AvField
                      name="courseURI"
                      tag={Field}
                      component={renderTextField}
                      label={TRANSLATE.t("TRAININGS.COURSE_URI")}
                      className="form-control"
                      placeholder={TRANSLATE.t("TRAININGS.COURSE_URI")}
                      type="text"
                      disabled = {eventType === "view" ? true : false}
                      validate={
                        !props.initialValues
                          ? {
                              required: {
                                value: true,
                                errorMessage: TRANSLATE.t("ERRORS.REQUIRED"),
                              },
                            }
                          : {}
                      }
                    />
                  </div>
                </CardBody>
                <div className="modal-footer">
                  {eventType !== "view" && (<button
                    className="btn btn-primary  waves-effect waves-light"
                    type="submit"
                    // disabled={pristine || submitting}
                  >
                    {eventType === "add"
                      ? TRANSLATE.t("ANNOUNCEMENT.ADD")
                      : TRANSLATE.t("ANNOUNCEMENT.SUBMIT")}
                  </button>)}
                  &ensp;
                  <button
                    className="btn btn-secondary  waves-effect waves-light"
                    type="submit"
                    onClick={toggle}
                  >
                    {TRANSLATE.t("ANNOUNCEMENT.BACK")}
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

AddVideoTraining.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  callApi: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  apiType: PropTypes.string.isRequired,
  eventType: PropTypes.string,
  initialValues: PropTypes.object,
  // modulesList: PropTypes.array.isRequired,
};

export default reduxForm({
  form: "AddVideoTraining",
})(AddVideoTraining);
