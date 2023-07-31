import React, { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Modal, CardBody } from "reactstrap";
import { TRANSLATE } from "../../constants";
// reduxform
import { reduxForm, Field } from "redux-form";
import { renderTextField } from "../../components/common/RenderTextField";
// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

const ValidationModal = (props) => {
  const [titleData, setTitleData] = useState("");
  const { title, callApi, apiType, initialValues } = props;
  const toggle = () => {
    props.handleModal();
  };

  const onSubmit = (formData) => {
    callApi(apiType, formData);
    toggle();
  };
  const { handleSubmit } = props;
  return (
    <div>
      <Modal
        className="modal bs-example-modal"
        isOpen={props.isOpen}
        toggle={toggle}
      >
        <Row>
          <Col>
            <div className="modal-content">
              <div className="modal-header bg-soft-primary">
                <i
                  className={"bx bx-task mr-3 ml-1"}
                  style={{ fontSize: "25px" }}
                ></i>
                <h5 className="mt-auto text-white">{title}</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  // aria-label="Close"
                  onClick={toggle}
                >
                  <span aria-hidden="true" className="close-button text-white">
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <AvForm
                  className="form-horizontal"
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <CardBody>
                    <div className="form-group">
                      <AvField
                        name="title"
                        tag={Field}
                        component={renderTextField}
                        label={TRANSLATE.t("ANNOUNCEMENT.TITLE")}
                        className="form-control"
                        placeholder={TRANSLATE.t("ANNOUNCEMENT.ENTER_TITLE")}
                        type="text"
                        disabled={initialValues ? true : false}
                        validate={{
                          required: {
                            value: true,
                            errorMessage: TRANSLATE.t("ERRORS.REQUIRED"),
                          },
                        }}
                        onChange={(e) => {
                          setTitleData(e.target.value);
                        }}
                      />
                    </div>
                  </CardBody>
                  <div className="modal-footer">
                    {!initialValues && (
                      <button
                        className="btn btn-primary  waves-effect waves-light"
                        type="submit"
                        disabled={!titleData}
                      >
                        {TRANSLATE.t("ANNOUNCEMENT.SUBMIT")}
                      </button>
                    )}
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
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
ValidationModal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  callApi: PropTypes.func.isRequired,
  apiType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func,
  initialValues: PropTypes.object,
};

export default reduxForm({
  form: "CloseRequestModal",
})(ValidationModal);
