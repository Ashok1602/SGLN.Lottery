import React, { useState } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { Button, Row, Col, Label, FormGroup } from "reactstrap";
import {
  renderTextField,
  renderDatePicker
} from "../../components/common/RenderTextField";
import CommonCollapse from "../../components/common/Collapse";
//constants
import { TRANSLATE } from "../../constants";

function Filter(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaxDate, setMaxDate] = useState(new Date());
  const [isMinDate, setMinDate] = useState(new Date());
  /*---------------on submit---------------*/
  const onSubmit = (formProps) => {
    props.onFilterSubmit(formProps);
  };
  //for date picker 
  const handleChange = (isMax, value) => {
    if (isMax) {
      setMaxDate(new Date(value));
    } else {
     setMinDate(new Date(value));
    }
   }
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
          <Label>{TRANSLATE.t('ANNOUNCEMENT.TITLE')}</Label>
            <Field
              name="title"
              component={renderTextField}
              type="text"
              maxLength={25}
              autoCapitalize={"true"}
              placeholder= {TRANSLATE.t('ANNOUNCEMENT.TITLE')}
            />
            </FormGroup>
          </Col>
          <Col md={3} className="my-1">
          <FormGroup>
          <Label>{TRANSLATE.t('FILTER.MIN_CREATION_DATE')}</Label>
            <Field
              name="minCreationDate"
              component={renderDatePicker}
              placeholder={TRANSLATE.t('FILTER.SELECT_MIN_DATE')}
              onChange={(e) => handleChange(false, e)}
              selectedValue={isMinDate}
            />
            </FormGroup>
          </Col>
          <Col md={3} className="my-1">
          <FormGroup>
          <Label>{TRANSLATE.t('FILTER.MAX_CREATION_DATE')}</Label>
            <Field
              name="maxCreationDate"
              component={renderDatePicker}
              placeholder={TRANSLATE.t('FILTER.SELECT_MAX_DATE')}
              onChange={(e) => handleChange(true, e)}
              selectedValue={isMaxDate}
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
  form: "docFilter", // a unique identifier for this form
})(Filter);
