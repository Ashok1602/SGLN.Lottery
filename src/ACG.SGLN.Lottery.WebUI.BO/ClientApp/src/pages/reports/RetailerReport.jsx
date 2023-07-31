import React, { useState } from 'react';
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
  Media,
} from 'reactstrap';
import { TRANSLATE } from '../../constants';
import { renderDatePicker } from '../../components/common/RenderTextField';
import { getRetailerReport } from '../../store/actions';
import moment from 'moment';

const TrainingByModule = (props) => {
  const dispatch = useDispatch();
  const [isMaxDate, setMaxDate] = useState(new Date());
  const [isMinDate, setMinDate] = useState(new Date());

  const nextProps = useSelector((state) => ({
    data: state.ReportModule.data,
  }));

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
    dispatch(getRetailerReport(formData));
  };
  const { handleSubmit } = props;
  return (
    <div className='mx-3'>
      <AvForm
        className='form-horizontal'
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card className='top-margin'>
          <CardHeader>
            <h1>{TRANSLATE.t('REPORT.DASHBOARD_RETAILER')}</h1>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <Label>{TRANSLATE.t('FILTER.MIN_CREATION_DATE')}</Label>
                <Field
                  name='fromDate'
                  component={renderDatePicker}
                  placeholder={moment().format('DD/MM/YYYY')}
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
                  minDate={isMinDate}
                />
              </Col>
              <Col>
                <Button
                  color='primary'
                  type='submit'
                  className='success-btn px-4 mx-2 mt-2'
                >
                  {TRANSLATE.t('SUBMIT')}
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Row style={{ marginBottom: '50%' }}>
          <Col md='4'>
            <Card className='mini-stats-wid'>
              <CardBody>
                <Media>
                  <Media body>
                    <p className='text-muted font-weight-medium'>
                    Nombre détaillants
                    </p>
                    <h4 className='mb-0'>
                      {nextProps.data
                        ? nextProps.data.countRegisteredRetailers
                        : 'NA'}
                    </h4>
                  </Media>
                  <div className='mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center'>
                    <span className='avatar-title'>
                      <i className={'bx bx-user font-size-24'}></i>
                    </span>
                  </div>
                </Media>
              </CardBody>
            </Card>
          </Col>
          <Col md='4'>
            <Card className='mini-stats-wid'>
              <CardBody>
                <Media>
                  <Media body>
                    <p className='text-muted font-weight-medium'>
                    Nombre détaillants active
                    </p>
                    <h4 className='mb-0'>
                      {nextProps.data
                        ? nextProps.data.countActiveRetailers
                        : 'NA'}
                    </h4>
                  </Media>
                  <div className='mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center'>
                    <span className='avatar-title'>
                      <i className={'bx bx-user-check font-size-24'}></i>
                    </span>
                  </div>
                </Media>
              </CardBody>
            </Card>
          </Col>
          <Col md='4'>
            <Card className='mini-stats-wid'>
              <CardBody>
                <Media>
                  <Media body>
                    <p className='text-muted font-weight-medium'>
                    Pourcentage détaillant active/Enregistré
                    </p>
                    <h4 className='mb-0'>
                      {nextProps.data
                        ? nextProps.data.ratioActiveRegistered
                        : 'NA'}
                    </h4>
                  </Media>
                  <div className='mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center'>
                    <span className='avatar-title'>
                      <i className={'bx bxs-user-detail font-size-24'}></i>
                    </span>
                  </div>
                </Media>
              </CardBody>
            </Card>
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
