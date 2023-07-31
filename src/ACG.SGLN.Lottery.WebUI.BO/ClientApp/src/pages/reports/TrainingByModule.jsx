import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { AvForm } from 'availity-reactstrap-validation';
import {
  Row,
  Col,
  Button,
  CardHeader,
  Card,
  CardBody,
  Label,
} from 'reactstrap';
import { TRANSLATE } from '../../constants';
import {
  renderTextField,
  renderSelectField,
  renderDatePicker,
} from '../../components/common/RenderTextField';
import {
  trainingReportByModule,
  getStrippedModules,
} from '../../store/actions';
import { renderOptions } from '../../helpers';
import moment from 'moment';
import { saveAs } from 'file-saver';

const TrainingByModule = (props) => {
  const dispatch = useDispatch();
  const [isMaxDate, setMaxDate] = useState(new Date());
  const [isMinDate, setMinDate] = useState(
    moment().subtract(3, 'months').startOf('month').toDate()
  );
  const [isGenerate, updateIsGenerate] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const nextProps = useSelector((state) => ({
    report: state.ReportModule.data,
    strippedModules: state.TrainingModule.data,
  }));
  useEffect(() => {
    dispatch(getStrippedModules());
  }, [dispatch]);
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (nextProps.strippedModules && nextProps.strippedModules.length) {
      setModulesList(
        nextProps.strippedModules.map((data) => {
          return {
            value: data.id,
            label: data.value,
          };
        })
      );
    }
  }, [nextProps.strippedModules]);
  const isSecond = useRef(true);
  useEffect(() => {
    if (isSecond.current) {
      isSecond.current = false;
      return;
    }
    if (nextProps.report && nextProps.report.data) {
      saveAs(
        nextProps.report.data.data,
        `${TRANSLATE.t('REPORT.TRAINING_BY_MODULE_REPORT')}.${isGenerate === 'Excel' ? 'xlsx' : 'pdf'}`
      );
    }
  }, [nextProps.report, isGenerate]);
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
    dispatch(trainingReportByModule(formData));
    updateIsGenerate(formData.documentFormat);
  };
  return (
    <div className='mx-3'>
      <AvForm className='form-horizontal' noValidate>
        <Card className='top-margin'>
          <CardHeader>
            <h1>{TRANSLATE.t('REPORT.TRAINING_BY_MODULE_REPORT')}</h1>
          </CardHeader>
          <CardBody>
            <Row className='mt-3'>
              <Col>
                <Label>{TRANSLATE.t('TRAININGS.CHOOSE_MODULES')}</Label>
                <Field
                  name='moduleId'
                  component={renderSelectField}
                  className='form-control p-2 field-style'
                  placeholder={TRANSLATE.t('TRAININGS.CHOOSE_MODULES')}
                  options={
                    modulesList && modulesList.length
                      ? renderOptions(modulesList, 'label', 'value')
                      : []
                  }
                />
              </Col>
              <Col>
                <Label>{TRANSLATE.t('REPORT.TRAINING_NAME')}</Label>
                <Field
                  name='training'
                  component={renderTextField}
                  className='p-2'
                  placeholder={TRANSLATE.t('REPORT.TRAINING_NAME')}
                  type='text'
                />
              </Col>
            </Row>
            <Row>
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
        <Row className='mt-3 d-flex justify-content-center' style={{marginBottom: "20%"}}>
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
              className='text-white'
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

TrainingByModule.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'TrainingByModule',
})(TrainingByModule);
