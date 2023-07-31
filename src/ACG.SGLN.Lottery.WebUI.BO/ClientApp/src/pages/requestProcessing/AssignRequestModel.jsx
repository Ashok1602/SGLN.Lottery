import React, { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Modal, FormGroup, Label, Input } from "reactstrap";
import { TRANSLATE } from "../../constants";
// reduxform
import { reduxForm, Field } from 'redux-form';
import {
  renderSelectField,
} from '../../components/common/RenderTextField';
// availity-reactstrap-validation
import { AvForm } from 'availity-reactstrap-validation';
import { renderOptions, getDirectionTypes } from '../../helpers';

const AssignRequestModel = (props) => {
  const [assignedTo, setAssignedTo] = useState(null);
  const { title, callApi, apiType } = props;

  const toggle = () => {
    props.handleModal();
  };
  const onChangeValue = (e) => {
    setAssignedTo(e.target.value);
  };

  const onSubmit = (formprops) => {
    callApi(apiType, {isExternal: assignedTo, processingDirection: formprops.processingDirection});
    toggle();
  }

  const { handleSubmit } = props;
  const directionTypesData=getDirectionTypes();
  
  return (
    <div>
      <Modal
        className="modal bs-example-modal"
        isOpen={props.isOpen}
        toggle={toggle}
      >
        <Row>
          <Col>
          <AvForm
                className='form-horizontal'
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
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
                        {TRANSLATE.t("REQUESTS.ISEXTERNAL_TRUE")}
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="isExternal" value={false} />
                        {TRANSLATE.t("REQUESTS.ISEXTERNAL_FALSE")}
                      </Label>
                    </FormGroup>
                  </FormGroup>
                  <FormGroup>
                     {assignedTo ==="false" &&
                     <div className='form-group mt-2'>
                        <Field
                          name='processingDirection'
                          component={renderSelectField}
                          className='form-control'
                          placeholder={TRANSLATE.t('DIRECTION_TYPE')}
                          options={
                              renderOptions(directionTypesData, "label", "value")
                          }
                        />
                      </div>}
                    </FormGroup>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  disabled={!assignedTo}
                  type={"submit"}
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
            </AvForm>
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
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'AssignRequest',
})(AssignRequestModel);