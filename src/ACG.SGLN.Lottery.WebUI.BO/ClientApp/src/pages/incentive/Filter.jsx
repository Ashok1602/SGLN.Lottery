import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { Button, Row, Col,Label, FormGroup, } from "reactstrap";
import {
  renderTextField,
  renderDatePicker,
} from "../../components/common/RenderTextField";
import CommonCollapse from "../../components/common/Collapse";
import { getStrippedRetailer } from "../../store/actions";
//constants
import {TRANSLATE} from "../../constants";
import AsyncSelect from "react-select/async";

function Filter(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaxDate, setMaxDate] = useState(new Date());
  const [isMinDate, setMinDate] = useState(new Date());
  const [retailersList, setRetailersList] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);

  const dispatch = useDispatch();

  /*------handling api data---------*/
  const nextProps = useSelector((state) => ({
    strippedRetailer: state.Retailer.data,
  }));

  const isSecondRun = useRef(true);
  useEffect(() => {
    if (isSecondRun.current) {
      isSecondRun.current = false;
      return;
    }
    if (nextProps.strippedRetailer && nextProps.strippedRetailer.length) {
      setRetailersList(
        nextProps.strippedRetailer.map((data) => {
          return {
            value: data.id,
            label: data.value,
          };
        })
      );
    }
  }, [nextProps.strippedRetailer]);

  /*---------------on submit---------------*/
  const onSubmit = (formProps) => {
    if (selectedRetailer) {
        formProps.retailerId = selectedRetailer;
      }
    props.onFilterSubmit(formProps);
  };

  /*---------------on reset---------------*/
  const onReset = () => {
    setRetailersList([]);
    props.reset();
    props.onFilterSubmit();
  };
  //for date picker 
  const handleChange = (isMax, value) => {
   if (isMax) {
     setMaxDate(new Date(value));
   } else {
    setMinDate(new Date(value));
   }
  }
  //functions for multi select
  const filterRetailers = (inputValue) => {
    return retailersList.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  const loadOptions = (inputValue, callback) => {
    if (inputValue.length > 2) {
      dispatch(getStrippedRetailer(inputValue));
    }
    setTimeout(() => {
      callback(filterRetailers(inputValue));
    }, 1000);
  };
  //function for get selected values
  function getSelectedValue(selectedData) {
    setSelectedRetailer(selectedData);
  }
  const { handleSubmit, pristine, submitting } = props;
  return (
    <CommonCollapse
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      title={TRANSLATE.t('FILTER.FILTER')}
      className="mx-4 my-1"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={3} className="my-1">
          <FormGroup>
          <Label>{TRANSLATE.t("INCENTIVE.MIN_GOAL")}</Label>
            <Field
              name="minGoal"
              component={renderTextField}
              type="number"
              maxLength={25}
              placeholder= {TRANSLATE.t("INCENTIVE.MIN_GOAL")}
            />
            </FormGroup>
          </Col>
          <Col md={3} className="my-1">
          <FormGroup>
          <Label>{TRANSLATE.t("INCENTIVE.MAX_GOAL")}</Label>
            <Field
              name="maxGoal"
              component={renderTextField}
              type="number"
              maxLength={25}
              placeholder= {TRANSLATE.t("INCENTIVE.MAX_GOAL")}
            />
            </FormGroup>
          </Col>
          <Col md={3} className="my-1">
          <FormGroup>
          <Label>{TRANSLATE.t("INCENTIVE.MIN_ACHIEVEMENT")}</Label>
            <Field
              name="minAchievement"
              component={renderTextField}
              type="number"
              maxLength={25}
              placeholder= {TRANSLATE.t("INCENTIVE.MIN_ACHIEVEMENT")}
            />
            </FormGroup>
          </Col>
          <Col md={3} className="my-1">
          <FormGroup>
          <Label>{TRANSLATE.t("INCENTIVE.MAX_ACHIEVEMENT")}</Label>
            <Field
              name="maxAchievement"
              component={renderTextField}
              type="number"
              maxLength={25}
              placeholder= {TRANSLATE.t("INCENTIVE.MAX_ACHIEVEMENT")}
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
            <div className="form-group">
              <FormGroup className="mb-0 templating-select select2-container">
                <label className="control-label">
                  {TRANSLATE.t("NOTIFICATION.CHOOSE_RETAILERS")} :
                </label>
                <AsyncSelect
                  isMulti={false}
                  loadOptions={loadOptions}
                  defaultOptions
                  onChange={getSelectedValue}
                />
              </FormGroup>
            </div>
          </Col>
          <Col md={3} className="my-1">
            <div className="">
              <Button
                color="primary"
                type="submit"
                className="success-btn px-4 mx-2 mt-2"
                disabled={selectedRetailer ? false : pristine || submitting}
              >
                {TRANSLATE.t('FILTER.SEARCH')}
              </Button>
              <Button
                color="secondary"
                onClick={onReset}
                className="mt-2"
                // disabled={ submitting}
              >
                {TRANSLATE.t('FILTER.RESET')}
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
  form: "IncentiveFilter", // a unique identifier for this form
})(Filter);
