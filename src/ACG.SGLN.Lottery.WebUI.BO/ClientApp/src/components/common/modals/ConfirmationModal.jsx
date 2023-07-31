import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Modal } from "reactstrap";
import { TRANSLATE } from "../../../constants";

const ConfirmationModal = (props) => {
  const { title, content, callApi, apiType } = props;

  const toggle = () => {
    props.handleModal();
  };
  const handleSubmit = () => {
    callApi(apiType);
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
                  // aria-label="Close"
                  onClick={toggle}
                >
                  <span aria-hidden="true" className="close-button text-white">
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <p>{content}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
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
ConfirmationModal.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  callApi: PropTypes.func.isRequired,
  apiType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func,
};
export default ConfirmationModal;
