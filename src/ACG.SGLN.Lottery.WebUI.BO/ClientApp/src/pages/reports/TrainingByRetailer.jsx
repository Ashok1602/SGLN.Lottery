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
  renderTextField,
  renderDatePicker,
} from '../../components/common/RenderTextField';
import {
  trainingReportByRetailer,
  getStrippedRetailer,
} from '../../store/actions';
import moment from 'moment';
import AsyncSelect from 'react-select/async';
import { saveAs } from 'file-saver';

const TrainingByRetailer = (props) => {
  const { reset } = props;
  const dispatch = useDispatch();
  const [isMaxDate, setMaxDate] = useState(new Date());
  const [isMinDate, setMinDate] = useState(
    moment().subtract(3, 'months').startOf('month').toDate()
  );
  const [isGenerate, updateIsGenerate] = useState(null);
  const [retailersList, setRetailersList] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const nextProps = useSelector((state) => ({
    report: state.ReportModule.data,
    strippedRetailer: state.Retailer.data,
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
        `${TRANSLATE.t('REPORT.TRAINING_BY_RETAILER_REPORT')}.${isGenerate === 'Excel' ? 'xlsx' : 'pdf'}`
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
    dispatch(trainingReportByRetailer(formData));
    updateIsGenerate(formData.documentFormat);
  };
  return (
    <div className='mx-3'>
      <AvForm className='form-horizontal' noValidate>
        <Card className='top-margin'>
          <CardHeader>
            <h1>{TRANSLATE.t('REPORT.TRAINING_BY_RETAILER_REPORT')}</h1>
          </CardHeader>
          <CardBody>
            <Row>
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
              <Col>
                <Label>{TRANSLATE.t('REPORT.RETAILER_CODE')}</Label>
                <Field
                  name='internalRetailerCode'
                  className='p-2'
                  component={renderTextField}
                  placeholder={TRANSLATE.t('REPORT.RETAILER_CODE')}
                  type='text'
                />
              </Col>
            </Row>
            <Row className='mt-2'>
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

TrainingByRetailer.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'TrainingByRetailer',
})(TrainingByRetailer);
