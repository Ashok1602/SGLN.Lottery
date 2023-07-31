import React, { useState } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { Button, Row, Col, Label, FormGroup } from "reactstrap";
import {
  renderDatePicker,
  renderTextField,
  renderSelectField,
} from "../../components/common/RenderTextField";
import CommonCollapse from "../../components/common/Collapse";
//constants
import { TRANSLATE } from "../../constants";
import { renderOptions } from "../../helpers";

function Filter(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  /*---------------on submit---------------*/
  const onSubmit = (formProps) => {
    props.onFilterSubmit(formProps);
  };

  /*---------------on reset---------------*/
  const onReset = () => {
    props.reset();
    props.onFilterSubmit();
  };

  //for date picker
  const handleStartDateChange = (value) => {
      setStartDate(new Date(value));
  };

  //for date picker
  const handleEndDateChange = (value) => {
      setEndDate(new Date(value));
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
              <Label>{TRANSLATE.t("APP_SETTINGS.TITLE")}</Label>
              <Field
                name="title"
                component={renderTextField}
                type="text"
                maxLength={25}
                autoCapitalize={"true"}
                placeholder={TRANSLATE.t("APP_SETTINGS.ENTER_TITLE")}
              />
            </FormGroup>
          </Col>
          {!props.isRemoveModule &&<Col md={3} className="my-1">
            <FormGroup>
              <Label>{TRANSLATE.t("TRAININGS.CHOOSE_MODULES")}</Label>
              <Field
                name="moduleId"
                component={renderSelectField}
                options={
                  props.modulesList && props.modulesList.length
                    ? renderOptions(props.modulesList, "label", "value")
                    : []
                }
                placeholder={TRANSLATE.t("TRAININGS.CHOOSE_MODULES")}
              />
            </FormGroup>
          </Col>}
          {props.type === "distanceTraining" && (
            <>
              <Col md={3} className="my-1">
                <FormGroup>
                  <Label>{TRANSLATE.t("FILTER.MIN_CREATION_DATE")}</Label>
                  <Field
                    name="startDate"
                    component={renderDatePicker}
                    placeholder={TRANSLATE.t("FILTER.MIN_CREATION_DATE")}
                    onChange={(e) => handleStartDateChange(e)}
                    selectedValue={startDate}
                  />
                </FormGroup>
              </Col>
              <Col md={3} className="my-1">
                <FormGroup>
                  <Label>{TRANSLATE.t("FILTER.MAX_CREATION_DATE")}</Label>
                  <Field
                    name="endDate"
                    component={renderDatePicker}
                    placeholder={TRANSLATE.t("FILTER.MAX_CREATION_DATE")}
                    onChange={(e) => handleEndDateChange(e)}
                    minDate={startDate}
                    selectedValue={endDate}
                  />
                </FormGroup>
              </Col>
            </>
          )}
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
  modulesList: PropTypes.array,
  type: PropTypes.string,
  isRemoveModule: PropTypes.bool
};
export default reduxForm({
  form: "filter", // a unique identifier for this form
})(Filter);
