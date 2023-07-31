import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, Label, FormGroup } from 'reactstrap';
import {
  renderTextField,
  renderSelectField,
  renderDatePicker,
} from '../../components/common/RenderTextField';
import CommonCollapse from '../../components/common/Collapse';
//constants
import { TRANSLATE } from '../../constants';
import { renderOptions } from '../../helpers';
import AsyncSelect from "react-select/async";
import { getStrippedRetailer } from "../../store/actions";
function Filter(props) {
  const { lastStatusData, requestCategoryData, requestNatureData } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [retailersList, setRetailersList] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [showSelect, updateShowSelect] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStrippedRetailer());
    setTimeout(() => {
      updateShowSelect(true)
    }, 2000)
  }, [])

  /*---------------on submit---------------*/
  const onSubmit = (formProps) => {
    if (selectedRetailer) {
      formProps.retailer = selectedRetailer.value;
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
  const handleStartDateChange = (value) => {
    setStartDate(new Date(value));
  };

  //for date picker
  const handleEndDateChange = (value) => {
    setEndDate(new Date(value));
  };

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
      title={TRANSLATE.t('FILTER.FILTER')}
      className='mx-4 my-1'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {/* <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('USERS.FIRST_NAME')}</Label>
              <Field
                name='firstName'
                component={renderTextField}
                type='text'
                maxLength={25}
                autoCapitalize={'true'}
                placeholder={TRANSLATE.t('USERS.ENTER_FIRST_NAME')}
              />
            </FormGroup>
          </Col> */}
          {/* <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('USERS.LAST_NAME')}</Label>
              <Field
                name='lastName'
                component={renderTextField}
                type='text'
                maxLength={25}
                autoCapitalize={'true'}
                placeholder={TRANSLATE.t('USERS.ENTER_LAST_NAME')}
              />
            </FormGroup>
          </Col> */}
          <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('REQUESTS.REQUEST_OBJECT')}</Label>
              <Field
                name='requestObject'
                component={renderTextField}
                type='text'
                maxLength={25}
                autoCapitalize={'true'}
                placeholder={TRANSLATE.t('REQUESTS.ENTER_REQUEST_OBJECT')}
              />
            </FormGroup>
          </Col>
          <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('REQUESTS.REQUEST_CATEGORY')}</Label>
              <Field
                name='requestCategory'
                component={renderSelectField}
                options={
                  requestCategoryData && requestCategoryData.length
                    ? renderOptions(requestCategoryData, 'value', 'id')
                    : []
                }
                placeholder={TRANSLATE.t('REQUESTS.REQUEST_CATEGORY')}
              />
            </FormGroup>
          </Col>
          <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('REQUESTS.DIRECTION_IN_CHARGE')}</Label>
              <Field
                name='directionInCharge'
                component={renderSelectField}
                options={
                  requestNatureData && requestNatureData.length
                    ? renderOptions(requestNatureData, 'label', 'value')
                    : []
                }
                placeholder={TRANSLATE.t('REQUESTS.DIRECTION_IN_CHARGE')}
              />
            </FormGroup>
          </Col>
          <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('REQUESTS.LAST_STATUS')}</Label>
              <Field
                name='lastStatus'
                component={renderSelectField}
                options={
                  lastStatusData && lastStatusData.length
                    ? renderOptions(lastStatusData, 'label', 'value')
                    : []
                }
                placeholder={TRANSLATE.t('REQUESTS.LAST_STATUS')}
              />
            </FormGroup>
          </Col>
          {/* <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('REQUESTS.RETAILER')}</Label>
              <Field
                name='retailer'
                component={renderTextField}
                type='text'
                maxLength={25}
                autoCapitalize={'true'}
                placeholder={TRANSLATE.t('REQUESTS.ENTER_RETAILER_NAME')}
              />
            </FormGroup>
          </Col> */}
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
          <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('REQUESTS.IS_NOTIFIED')}</Label>
              <Field
                name='isNotified'
                component={renderSelectField}
                placeholder={TRANSLATE.t('REQUESTS.IS_NOTIFIED')}
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
          {/* <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('USERS.PHONE_NUMBER')}</Label>
              <Field
                name='phone'
                component={renderTextField}
                type='text'
                maxLength={25}
                autoCapitalize={'true'}
                placeholder={TRANSLATE.t('USERS.ENTER_PHONE_NUMBER')}
              />
            </FormGroup>
          </Col> */}
          <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('FILTER.MIN_CREATION_DATE')}</Label>
              <Field
                name='startDate'
                component={renderDatePicker}
                placeholder={TRANSLATE.t('FILTER.MIN_CREATION_DATE')}
                onChange={(e) => handleStartDateChange(e)}
                selectedValue={startDate}
              />
            </FormGroup>
          </Col>
          <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('FILTER.MAX_CREATION_DATE')}</Label>
              <Field
                name='endDate'
                component={renderDatePicker}
                placeholder={TRANSLATE.t('FILTER.MAX_CREATION_DATE')}
                onChange={(e) => handleEndDateChange(e)}
                minDate={startDate}
                selectedValue={endDate}
              />
            </FormGroup>
          </Col>
          <Col md={3} className='my-1'>
            <div className=''>
              <Button
                color='primary'
                type='submit'
                className='success-btn px-4 mx-2 mt-2'
              >
                {TRANSLATE.t('FILTER.SEARCH')}
              </Button>
              <Button
                color='secondary'
                onClick={onReset}
                className='mt-2'
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
  lastStatusData: PropTypes.array.isRequired,
  requestCategoryData: PropTypes.array.isRequired,
  requestNatureData: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};
export default reduxForm({
  form: 'requestFilter', // a unique identifier for this form
})(Filter);
