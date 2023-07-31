import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { AvForm } from 'availity-reactstrap-validation';
import {
  CardHeader,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Label,
} from 'reactstrap';
import { TRANSLATE } from '../../constants';
import {
  renderDatePicker,
  renderSelectField,
} from '../../components/common/RenderTextField';
import {
  generateRequestReport,
  getStrippedRetailer,
  getStrippedCategory,
} from '../../store/actions';
import moment from 'moment';
import AsyncSelect from 'react-select/async';
import { saveAs } from 'file-saver';
import {
  renderOptions,
  getRequestNatureTypes,
  getRequestStatusTypes,
} from '../../helpers';

const RequestReport = (props) => {
  const { reset } = props;
  const dispatch = useDispatch();
  const [isMaxDate, setMaxDate] = useState(new Date());
  const [isMinDate, setMinDate] = useState(
    moment().subtract(3, 'months').startOf('month').toDate()
  );
  const [showSelect, updateShowSelect] = useState(false);
  const [isGenerate, updateIsGenerate] = useState(null);
  const [retailersList, setRetailersList] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);

  useEffect(() => {
    dispatch(getStrippedRetailer());

    setTimeout(() => {
      updateShowSelect(true);
    }, 1000);
  }, []);

  useEffect(() => {
    dispatch(getStrippedCategory());
  }, [dispatch]);

  const nextProps = useSelector((state) => ({
    report: state.ReportModule.requestReportData,
    strippedRetailer: state.Retailer.data,
    categoriesList: state.RequestCategory.strippedData,
  }));

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
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
  const isSecond = useRef(true);
  useEffect(() => {
    if (isSecond.current) {
      isSecond.current = false;
      return;
    }
    if (nextProps.report && nextProps.report.data) {
      saveAs(
        nextProps.report.data.data,
        `${TRANSLATE.t('REPORT.REQUEST')}.${isGenerate === 'Excel' ? 'xlsx' : 'pdf'}`
      );
      reset();
    }
  }, [nextProps.report, isGenerate, reset]);
  //functions for multi select
  const filterRetailers = (inputValue) => {
    return retailersList.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  //function for get selected values
  function getSelectedValue(selectedData) {
    setSelectedRetailer(selectedData);
  }
  const loadOptions = (inputValue, callback) => {
    if (inputValue.length >= 4) {
      dispatch(getStrippedRetailer(inputValue));
    }
    setTimeout(() => {
      callback(filterRetailers(inputValue));
    }, 1000);
  };
  //for date picker
  const handleChange = (isMax, value) => {
    if (isMax) {
      setMaxDate(new Date(value));
    } else {
      setMinDate(new Date(value));
    }
  };
  const onSubmit = (formData) => {
    if (!formData.fromDate) {
      formData.fromDate = isMinDate;
    }
    if (!formData.toDate) {
      formData.toDate = isMaxDate;
    }
    if (selectedRetailer?.value) {
      formData.retailerId = selectedRetailer.value;
    }
    dispatch(generateRequestReport(formData));
    updateIsGenerate(formData.documentFormat);
  };
  const requestNatureData = getRequestNatureTypes();
  const lastStatusData = getRequestStatusTypes();
  return (
    <div className='mx-3'>
      <AvForm className='form-horizontal' noValidate>
        <Card className='top-margin'>
          <CardHeader>
            <h1>{TRANSLATE.t('REPORT.REQUEST')}</h1>
          </CardHeader>
          <CardBody>
            <Row>
              {showSelect && (
                <Col>
                  <label className='control-label'>
                    {TRANSLATE.t('NOTIFICATION.CHOOSE_RETAILERS')} :
                  </label>
                  <AsyncSelect
                    isMulti={false}
                    loadOptions={loadOptions}
                    defaultOptions
                    value={selectedRetailer}
                    onChange={getSelectedValue}
                  />
                </Col>
              )}
              <Col>
                <Label>{TRANSLATE.t('REQUESTS.REQUEST_CATEGORY')}</Label>
                <Field
                  name='requestCategoryId'
                  component={renderSelectField}
                  options={
                    nextProps.categoriesList && nextProps.categoriesList.length
                      ? renderOptions(nextProps.categoriesList, 'value', 'id')
                      : []
                  }
                  placeholder={TRANSLATE.t('REQUESTS.REQUEST_CATEGORY')}
                />
              </Col>
              <Col>
                <Label>{TRANSLATE.t('REQUESTS.DIRECTION_IN_CHARGE')}</Label>
                <Field
                  name='nature'
                  component={renderSelectField}
                  options={
                    requestNatureData && requestNatureData.length
                      ? renderOptions(requestNatureData, 'label', 'value')
                      : []
                  }
                  placeholder={TRANSLATE.t('REQUESTS.DIRECTION_IN_CHARGE')}
                />
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col>
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
              </Col>
              <Col>
                <Label>{TRANSLATE.t('FILTER.MIN_CREATION_DATE')}</Label>
                <Field
                  name='fromDate'
                  component={renderDatePicker}
                  placeholder={moment()
                    .subtract(3, 'months')
                    .startOf('month')
                    .format('DD/MM/YYYY')}
                  onChange={(e) => handleChange(false, e)}
                  selectedValue={isMinDate}
                />
              </Col>
              <Col>
                <Label>{TRANSLATE.t('FILTER.MAX_CREATION_DATE')}</Label>
                <Field
                  name='toDate'
                  component={renderDatePicker}
                  placeholder={moment().format('DD/MM/YYYY')}
                  onChange={(e) => handleChange(true, e)}
                  selectedValue={isMaxDate}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Row
          className='mt-3 d-flex justify-content-center'
          style={{ marginBottom: '20%' }}
        >
          <Col xl='2'>
            <Button
              color='primary'
              size='lg'
              onClick={props.handleSubmit((values) => {
                values.documentFormat = 'Pdf';
                onSubmit(values);
              })}
            >
              {TRANSLATE.t('REPORT.EXPORT_AS_PDF')}
            </Button>
          </Col>
          <Col xl='2'>
            <Button
              color='secondary'
              size='lg'
              onClick={props.handleSubmit((values) => {
                values.documentFormat = 'Excel';
                onSubmit(values);
              })}
            >
              {TRANSLATE.t('REPORT.EXPORT_AS_EXCEL')}
            </Button>
          </Col>
        </Row>
      </AvForm>
    </div>
  );
};

RequestReport.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'RequestsReports',
})(RequestReport);
