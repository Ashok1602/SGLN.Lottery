import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
//react-redux
import { useSelector, useDispatch } from 'react-redux';
import {
  addNotification,
  getStrippedRetailer,
  getFromFile,
} from '../../store/actions';
// reduxform
import { reduxForm, Field } from 'redux-form';
import {
  renderTextField,
  renderRadioButton,
} from '../../components/common/RenderTextField';
// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';
//constants
import { TRANSLATE, NOTIFITION_DD_ACCEPTED_FILES } from '../../constants';
import {
  Row,
  Col,
  CardBody,
  Container,
  Modal,
  FormGroup,
  Label,
} from 'reactstrap';
import AsyncSelect from 'react-select/async';
import Dropzone from '../../components/common/Dropzone';

const AddNotification = (props) => {
  const { title, apiType, callApi, eventType } = props;
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [retailersList, setRetailersList] = useState([]);
  // const [selectedFile, updateFile] = useState(null);
  const [sendType, updateSendType] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStrippedRetailer());
  }, [])

  /*------handling api data---------*/
  const nextProps = useSelector((state) => ({
    strippedRetailer: state.Retailer.data,
    data: state.Notification.createData || state.Notification.updateData,
    retailersDataFromFile: state.Retailer.retailersData
  }));

  const mount = useRef(() => {
    toggle();
    callApi(apiType);
  });
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (nextProps.data) {
      mount.current();
    }
  }, [nextProps.data]);

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

  const isThridRun = useRef(true);
  useEffect(() => {
    if (isThridRun.current) {
      isThridRun.current = false;
      return;
    }
    if (nextProps.retailersDataFromFile && nextProps.retailersDataFromFile.length) {
      setSelectedRetailer(
        nextProps.retailersDataFromFile.map((data) => {
          return {
            value: data.id,
            label: data.value,
          };
        })
      );
    }
  }, [nextProps.retailersDataFromFile]);

  //function for get selected values
  function getSelectedValue(selectedData) {
    setSelectedRetailer(selectedData);
  }

  //for toggle modal
  const toggle = () => {
    props.handleModal();
  };

  //functions for multi select
  const filterRetailers = (inputValue) => {
    return retailersList.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  const loadOptions = (inputValue, callback) => {
    if (inputValue.length >= 3) {
      dispatch(getStrippedRetailer(inputValue));
    }
    setTimeout(() => {
      callback(filterRetailers(inputValue));
    }, 1000);
  };

  //for submit form
  function onSubmit(formData) {
    formData.requiredKeys = {
      type: TRANSLATE.t('NOTIFICATION.SELECT_NOTIFICATION_TYPE'),
      sendTo: TRANSLATE.t('NOTIFICATION.SEND_TO'),
      title: TRANSLATE.t('ANNOUNCEMENT.TITLE'),
      body: TRANSLATE.t('ANNOUNCEMENT.DESCRIPTION')
    };
    if (selectedRetailer && formData.sendTo === 'Targeted') {
      formData.targetRetailerIds = selectedRetailer.map((retailer) => {
        return retailer.value;
      });
    }
    dispatch(addNotification(formData));
  }

  const handleFileChange = (files) => {
    if (files[0]) {
      dispatch(getFromFile({ excelFile: {data: files[0], fileName: files[0].name} }));
    }
  };
  const onFileDelete = () => {
    setSelectedRetailer([]);
  };

  const { handleSubmit } = props;
  return (
    <div>
      <Modal
        className='account-pages my-5 pt-sm-5'
        isOpen={props.isOpen}
        toggle={toggle}
        size='lg'
      >
        <Container>
          <Row className='justify-content-center'>
            <Col style={{ padding: '0' }}>
              <AvForm
                className='form-horizontal'
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className='bg-soft-primary'>
                  <Row>
                    <Col>
                      <div className='modal-header bg-soft-primary'>
                        <i
                          className={'mdi mdi-bell-plus mr-3 ml-1'}
                          style={{ fontSize: '25px' }}
                        ></i>
                        <h5 className='mt-auto text-white'>{title}</h5>
                        <button
                          type='button'
                          className='close'
                          data-dismiss='modal'
                          onClick={toggle}
                        >
                          <span
                            aria-hidden='true'
                            className='close-button text-white'
                          >
                            &times;
                          </span>
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody>
                  <Row className='mb-3 mt-1'>
                    <Col>
                      <Label className='d-block mb-2'>
                        {TRANSLATE.t('NOTIFICATION.SELECT_NOTIFICATION_TYPE')} :
                      </Label>
                      {!props.initialValues ? (
                        <Row>
                          <Col xl='4'>
                            <Field
                              name='type'
                              component={renderRadioButton}
                              type='radio'
                              value={'Alert'}
                              label={TRANSLATE.t('NOTIFICATION.ALERTS')}
                            />
                          </Col>
                          <Col xl='3'>
                            <Field
                              name='type'
                              component={renderRadioButton}
                              type='radio'
                              value={'Notification'}
                              label={TRANSLATE.t('NOTIFICATION.NOTIFICATION')}
                            />
                          </Col>
                        </Row>
                      ) : (
                        <Row>
                          <Col>{props.initialValues.type}</Col>
                        </Row>
                      )}
                    </Col>
                    <Col>
                      <Label className='d-block mb-2'>
                        {TRANSLATE.t('NOTIFICATION.SEND_TO')} :
                      </Label>
                      {!props.initialValues ? (
                        <Row>
                          <Col xl='4'>
                            <Field
                              name='sendTo'
                              component={renderRadioButton}
                              type='radio'
                              onChange={(e) => updateSendType(e.target.value)}
                              value={'All'}
                              label={TRANSLATE.t('NOTIFICATION.ALL')}
                            />
                          </Col>
                          <Col xl='3'>
                            <Field
                              name='sendTo'
                              component={renderRadioButton}
                              type='radio'
                              onChange={(e) => updateSendType(e.target.value)}
                              value={'Targeted'}
                              label={TRANSLATE.t('NOTIFICATION.TARGATED')}
                            />
                          </Col>
                        </Row>
                      ) : (
                        <Row>
                          <Col>
                            { props.initialValues && props.initialValues.targetRetailers
                             && props.initialValues.targetRetailers.length
                              ? TRANSLATE.t('NOTIFICATION.TARGATED')
                              : TRANSLATE.t('NOTIFICATION.ALL')}
                          </Col>
                        </Row>
                      )}
                    </Col>
                  </Row>
                  {sendType === 'Targeted' ? (
                    <>
                      <div className='form-group'>
                        <Label>
                          {TRANSLATE.t('DOC_SUPPORT.UPLOAD_DOCUMENT')}
                        </Label>
                        <div className='custom-file reduce-height'>
                          <Dropzone
                            handleChange={handleFileChange}
                            isShowPreview={false}
                            toggle={onFileDelete}
                            showPreviewsInDropzone={true}
                            acceptedFiles={NOTIFITION_DD_ACCEPTED_FILES}
                            filesLimit={1}
                          />
                        </div>
                      </div>
                      <div className='form-group'>
                        <FormGroup className='mb-0 templating-select select2-container'>
                          <label className='control-label'>
                            {TRANSLATE.t('NOTIFICATION.CHOOSE_RETAILERS')} :
                          </label>
                          <AsyncSelect
                            isMulti={true}
                            loadOptions={loadOptions}
                            defaultOptions
                            value={selectedRetailer}
                            onChange={getSelectedValue}
                          />
                        </FormGroup>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                  {props.initialValues && props.initialValues.targetRetailers &&
                  props.initialValues.targetRetailers.length ? (
                    <div className='retailers-container'>
                      {props.initialValues.targetRetailers.map((data) => {
                        return (
                          <span key={data.id} className='retailer-style'>
                            {data.firstName} {data.lastName}({data.internalRetailerCode || "NA"})
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    ''
                  )}
                  <div className='form-group'>
                    <AvField
                      name='title'
                      tag={Field}
                      component={renderTextField}
                      label={TRANSLATE.t('ANNOUNCEMENT.TITLE')}
                      className='form-control'
                      placeholder={TRANSLATE.t('ANNOUNCEMENT.ENTER_TITLE')}
                      type='text'
                      disabled={props.initialValues ? true : false}
                      validate={
                        !props.initialValues
                          ? {
                              required: {
                                value: true,
                                errorMessage: TRANSLATE.t('ERRORS.REQUIRED'),
                              },
                            }
                          : {}
                      }
                    />
                  </div>
                  <div className='form-group'>
                    <AvField
                      name='body'
                      tag={Field}
                      component={renderTextField}
                      label={TRANSLATE.t('ANNOUNCEMENT.DESCRIPTION')}
                      className='form-control'
                      placeholder={TRANSLATE.t(
                        'ANNOUNCEMENT.ENTER_DESCRIPTION'
                      )}
                      type='textarea'
                      rows="7"
                      disabled={props.initialValues? true: false}
                      validate={!props.initialValues ? {
                        required: {
                          value: true,
                          errorMessage: TRANSLATE.t('ERRORS.REQUIRED'),
                        },
                      } : {}}
                    />
                  </div>
                </CardBody>
                <div className='modal-footer'>
                  {!props.initialValues && (
                    <button
                      className='btn btn-primary  waves-effect waves-light'
                      type='submit'
                      // disabled={pristine || submitting}
                    >
                      {eventType === 'add'
                        ? TRANSLATE.t('ANNOUNCEMENT.ADD')
                        : TRANSLATE.t('ANNOUNCEMENT.SENT')}
                    </button>
                  )}
                  &ensp;
                  <button
                    className='btn btn-secondary  waves-effect waves-light'
                    type='submit'
                    onClick={toggle}
                  >
                    {TRANSLATE.t('ANNOUNCEMENT.BACK')}
                  </button>
                </div>
              </AvForm>
            </Col>
          </Row>
        </Container>
      </Modal>
    </div>
  );
};

AddNotification.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  callApi: PropTypes.func,
  title: PropTypes.string.isRequired,
  apiType: PropTypes.string,
  eventType: PropTypes.string,
  initialValues: PropTypes.object,
};

export default reduxForm({
  form: 'addNotification',
})(AddNotification);
