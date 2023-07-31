import React, { useState } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { Button, Row, Col, Label, FormGroup } from "reactstrap";
import {
  renderTextField,
  renderSelectField,
} from "../../components/common/RenderTextField";
import CommonCollapse from "../../components/common/Collapse";
//constants
import { TRANSLATE } from "../../constants";
import { renderOptions } from "../../helpers";

function Filter(props) {
  const [isOpen, setIsOpen] = useState(false);
  /*---------------on submit---------------*/
  const onSubmit = (formProps) => {
    props.onFilterSubmit(formProps);
  };
  /*---------------on reset---------------*/
  const onReset = () => {
    props.reset();
    props.onFilterSubmit();
  };
  const { handleSubmit, pristine, submitting } = props;
  return (
    <CommonCollapse
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      title={TRANSLATE.t("FILTER.FILTER")}
      className="mx-4 my-1"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={3} className="my-1">
            <FormGroup>
              <Label>{TRANSLATE.t("REQUESTS.LAST_NAME")}</Label>
              <Field
                name="lastName"
                component={renderTextField}
                type="text"
                maxLength={25}
                autoCapitalize={"true"}
                placeholder={TRANSLATE.t("USERS.ENTER_LAST_NAME")}
              />
            </FormGroup>
          </Col>
          <Col md={3} className="my-1">
            <FormGroup>
              <Label>{TRANSLATE.t("REQUESTS.FIRST_NAME")}</Label>
              <Field
                name="firstName"
                component={renderTextField}
                type="text"
                maxLength={25}
                autoCapitalize={"true"}
                placeholder={TRANSLATE.t("USERS.ENTER_FIRST_NAME")}
              />
            </FormGroup>
          </Col>
          <Col md={3} className="my-1">
            <FormGroup>
              <Label>{TRANSLATE.t("USERS.PHONE_NUMBER")}</Label>
              <Field
                name="phone"
                component={renderTextField}
                type="text"
                maxLength={25}
                autoCapitalize={"true"}
                placeholder={TRANSLATE.t("USERS.ENTER_PHONE_NUMBER")}
              />
            </FormGroup>
          </Col>
          <Col md={3} className="my-1">
            <FormGroup>
              <Label>{TRANSLATE.t("REQUESTS.IS_NOTIFIED")}</Label>
              <Field
                name="isNotified"
                component={renderSelectField}
                placeholder= {TRANSLATE.t("REQUESTS.IS_NOTIFIED")}
                options={renderOptions(
                  [
                    { value: 'Yes', label: 'Oui' },
                    { value: 'No', label: 'Non' },
                  ],
                  'label',
                  'value'
                )}
              />
            </FormGroup>
          </Col>
          <Col md={3} className="my-1">
            <div className="">
              <Button
                color="primary"
                type="submit"
                className="success-btn px-4 mx-2 mt-2"
                disabled={pristine || submitting}
              >
                {TRANSLATE.t("FILTER.SEARCH")}
              </Button>
              <Button
                color="secondary"
                onClick={onReset}
                className="mt-2"
                // disabled={ submitting}
              >
                {TRANSLATE.t("FILTER.RESET")}
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </CommonCollapse>
  );
}
Filter.propTypes = {
  // nextProps: PropTypes.object.isRequired,
  onFilterSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};
export default reduxForm({
  form: "retailerFilter", // a unique identifier for this form
})(Filter);
