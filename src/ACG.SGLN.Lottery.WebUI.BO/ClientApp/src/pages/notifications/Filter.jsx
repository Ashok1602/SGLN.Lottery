import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, Label, FormGroup } from "reactstrap";
import {
  renderTextField,
  renderDatePicker,
  renderSelectField,
} from "../../components/common/RenderTextField";
import CommonCollapse from "../../components/common/Collapse";
import { getStrippedRetailer } from "../../store/actions";
//constants
import { TRANSLATE } from "../../constants";
import { renderOptions } from "../../helpers";
import AsyncSelect from "react-select/async";
function Filter(props) {
  const { notificationTypeData } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [retailersList, setRetailersList] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [isMaxDate, setMaxDate] = useState(new Date());
  const [isMinDate, setMinDate] = useState(new Date());
  const [showSelect, updateShowSelect] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStrippedRetailer());

    setTimeout(() => {
      updateShowSelect(true)
    }, 2000)
  }, [])

  /*------handling api data---------*/
  const nextProps = useSelector((state) => ({
    strippedRetailer: state.Retailer.data,
    data: state.Notification.createData || state.Notification.updateData,
  }));

  /*---------------on submit---------------*/
  const onSubmit = (formProps) => {
    if (selectedRetailer) {
      formProps.targetRetailerId = selectedRetailer.value;
    }
    props.onFilterSubmit(formProps);
  };

  /*---------------on reset---------------*/
  const onReset = () => {
    props.reset();
    props.onFilterSubmit();
    setSelectedRetailer(null);
  };
  //for date picker
  const handleChange = (isMax, value) => {
    if (isMax) {
      setMaxDate(new Date(value));
    } else {
      setMinDate(new Date(value));
    }
  };
  
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
  
  //functions for multi select
  const filterRetailers = (inputValue) => {
    return retailersList.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  const loadOptions = (inputValue, callback) => {
    if (inputValue.length >=3 ) {
      dispatch(getStrippedRetailer(inputValue));
    }
    setTimeout(() => {
      callback(filterRetailers(inputValue));
    }, 2000);
  };
  //function for get selected values
  function getSelectedValue(selectedData) {
    setSelectedRetailer(selectedData);
  }
  const { handleSubmit } = props;
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
              <Label>{TRANSLATE.t("ANNOUNCEMENT.TITLE")}</Label>
              <Field
                name="title"
                component={renderTextField}
                type="text"
                maxLength={25}
                autoCapitalize={"true"}
                placeholder={TRANSLATE.t("ANNOUNCEMENT.TITLE")}
              />
            </FormGroup>
          </Col>
          <Col md={3} className="my-1">
            <FormGroup>
              <Label>{TRANSLATE.t("ANNOUNCEMENT.DESCRIPTION")}</Label>
              <Field
                name="body"
                component={renderTextField}
                type="text"
                maxLength={25}
                autoCapitalize={"true"}
                placeholder={TRANSLATE.t("ANNOUNCEMENT.ENTER_DESCRIPTION")}
              />
            </FormGroup>
          </Col>
          <Col md={3} className="my-1">
            <FormGroup>
              <Label>{TRANSLATE.t("NOTIFICATION.TYPE")}</Label>
              <Field
                name="type"
                component={renderSelectField}
                options={
                  notificationTypeData && notificationTypeData.length
                    ? renderOptions(notificationTypeData, "label", "value")
                    : []
                }
                placeholder={TRANSLATE.t("NOTIFICATION.TYPE")}
              />
            </FormGroup>
          </Col>
          {showSelect && <Col md={3} className="my-1">
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
                  value={selectedRetailer}
                />
              </FormGroup>
            </div>
          </Col>}
          <Col md={3} className="my-1">
            <FormGroup>
              <Label>{TRANSLATE.t("FILTER.MIN_CREATION_DATE")}</Label>
              <Field
                name="minCreationDate"
                component={renderDatePicker}
                placeholder={TRANSLATE.t("FILTER.SELECT_MIN_DATE")}
                onChange={(e) => handleChange(false, e)}
                selectedValue={isMinDate}
              />
            </FormGroup>
          </Col>
          <Col md={3} className="my-1">
            <FormGroup>
              <Label>{TRANSLATE.t("FILTER.MAX_CREATION_DATE")}</Label>
              <Field
                name="maxCreationDate"
                component={renderDatePicker}
                placeholder={TRANSLATE.t("FILTER.SELECT_MIN_DATE")}
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
  notificationTypeData: PropTypes.array.isRequired,
};
export default reduxForm({
  form: "filter", // a unique identifier for this form
})(Filter);
