import React, { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Modal, CardBody } from "reactstrap";
import { TRANSLATE } from "../../../constants";
// reduxform
import { reduxForm, Field } from "redux-form";
import { renderTextField } from "../../../components/common/RenderTextField";
// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

const CreateCommentModal = (props) => {
  const { title, callApi, apiType } = props;
  const [body, setBody] = useState("");

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
                <h5 className="text-white">{title}</h5>
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
                        name="body"
                        tag={Field}
                        component={renderTextField}
                        label={TRANSLATE.t("REQUESTS.DESCRIPTION")}
                        className="form-control"
                        placeholder={TRANSLATE.t(
                          "ANNOUNCEMENT.ENTER_DESCRIPTION"
                        )}
                        type="textarea"
                        rows="7"
                        onChange = {(e)=> {
                          setBody(e.target.value);
                        }}
                        validate={{
                          required: {
                            value: true,
                            errorMessage: TRANSLATE.t("ERRORS.REQUIRED"),
                          },
                        }}
                      />
                    </div>
                  </CardBody>
                  <div className="modal-footer">
                    <button
                      className="btn btn-primary  waves-effect waves-light"
                      type="submit"
                      disabled={!body}
                    >
                      {TRANSLATE.t("REQUESTS.YES")}
                    </button>
                    &ensp;
                    <button
                      className="btn btn-secondary  waves-effect waves-light"
                      type="submit"
                      onClick={toggle}
                    >
                      {TRANSLATE.t("REQUESTS.NO")}
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
CreateCommentModal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  callApi: PropTypes.func.isRequired,
  apiType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func,
};

export default reduxForm({
  form: "CloseRequestModal",
})(CreateCommentModal);
