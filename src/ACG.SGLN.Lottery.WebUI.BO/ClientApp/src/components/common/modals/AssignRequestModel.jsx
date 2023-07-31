import React, { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Modal, FormGroup, Label, Input } from "reactstrap";
import { TRANSLATE } from "../../../constants";

const AssignRequestModel = (props) => {
  const [assignedTo, setAssignedTo] = useState(null);
  const { title, callApi, apiType } = props;

  const toggle = () => {
    props.handleModal();
  };
  const onChangeValue = (e) => {
    setAssignedTo(e.target.value);
  };
  const handleSubmit = () => {
    callApi(apiType, assignedTo);
    toggle();
  };
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
                  onClick={toggle}
                >
                  <span aria-hidden="true" className="close-button text-white">
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <FormGroup tag="fieldset" onChange={onChangeValue}>
                    <legend>{TRANSLATE.t("REQUESTS.ASSIGNED_TO")}</legend>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="isExternal" value={true} />
                        {TRANSLATE.t("APP_SETTINGS.ISEXTERNAL_TRUE")}
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="isExternal" value={false} />
                        {TRANSLATE.t("APP_SETTINGS.ISEXTERNAL_FALSE")}
                      </Label>
                    </FormGroup>
                  </FormGroup>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!assignedTo}
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  {TRANSLATE.t("YES")}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={toggle}
                >
                  {TRANSLATE.t("NO")}
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
AssignRequestModel.propTypes = {
  title: PropTypes.string.isRequired,
  callApi: PropTypes.func.isRequired,
  apiType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func,
};
export default AssignRequestModel;
