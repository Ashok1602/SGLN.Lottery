import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
//react-redux
import { useSelector, useDispatch } from 'react-redux';
import {
  addLiveTraining,
  editLiveTraining,
  deleteDocument,
} from '../../../store/actions';
// reduxform
import { reduxForm, Field } from 'redux-form';
import {
  renderTextField,
  renderDatePicker,
} from "../../../components/common/RenderTextField";
// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';
//constants
import { TRANSLATE, MAX_FILE_SIZE } from "../../../constants";
import { convertUtcDate } from "../../../helpers";
import { Row, Col, CardBody, Container, Modal, Label } from "reactstrap";
import Dropzone from "../../../components/common/Dropzone";
import { BASE_URL } from "../../../actions/config";

const AddDistanceTraining = (props) => {
  const { title, apiType, callApi, eventType, initialValues } =
    props;
  // const [selectedModule] = useState(
  //   initialValues?.moduleId
  //     ? modulesList.filter((data) => data.value === initialValues?.moduleId)
  //     : []
  // );
  const [docsData, updateDocsData] = useState([]);
  const [selectedFile, updateFile] = useState(null);
  const [startDate, setStartDate] = useState(
    initialValues && initialValues.startDate
      ? convertUtcDate(initialValues.startDate)
      : null
  );
  const [endDate, setEndDate] = useState(
    initialValues && initialValues.endDate
      ? convertUtcDate(initialValues.endDate)
      : new Date()
  );

  const documentTypesData = JSON.parse(
    localStorage.getItem("resourceInfo") || "{}"
  ).DocumentType;

  useEffect(() => {
    if (initialValues) {
      updateDocsData(initialValues.documents);
    }
  }, [initialValues]);

  const dispatch = useDispatch();

  //for toggle modal
  const toggle = () => {
    props.handleModal();
  };
  /*------handling api data---------*/
  const nextProps = useSelector((state) => ({
    strippedModules: state.TrainingModule.data,
    data: state.Trainings.addLiveTrainingData,
    dataById: state.Trainings.editLiveTrainingData,
    deleteDocSuccess: state.Documents.deleteData,
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

  const isDeleteDoc = useRef(true);
  useEffect(() => {
    if (isDeleteDoc.current) {
      isDeleteDoc.current = false;
      return;
    }
    if (nextProps.deleteDocSuccess) {
      updateDocsData([]);
    }
  }, [nextProps.deleteDocSuccess]);

  const dataByIdmount = useRef(() => {
    toggle();
    callApi(apiType);
  });
  const isDataById = useRef(true);
  useEffect(() => {
    if (isDataById.current) {
      isDataById.current = false;
      return;
    }
    if (nextProps.dataById) {
      dataByIdmount.current();
    }
  }, [nextProps.dataById]);
  //for date picker
  const handleChange = (isMax, value) => {
    if (isMax) {
      setStartDate(new Date(value));
    } else {
      setEndDate(new Date(value));
    }
  };
  const handleFileChange = (files) => {
    if (files[0]) {
      if (files[0] && files[0].size <= MAX_FILE_SIZE) {
        updateFile(files[0]);
      }
    }
  };
  const onFileDelete = () => {
    updateFile(null);
  };
  //for submit form
  function onSubmit(formData) {
    // if (formData.startDate) {
    //   formData.startDate = formData.startDate;
    // }
    // if (formData.endDate) {
    //   formData.endDate = formData.endDate;
    // }
    if (selectedFile) {
      formData.supportDocument = {
        data: selectedFile,
        fileName: selectedFile.name,
      };
    }
    if (initialValues) {
      dispatch(editLiveTraining(formData));
    } else {
      formData.requiredKeys = {
        title: TRANSLATE.t('ANNOUNCEMENT.TITLE'),
        courseURI: TRANSLATE.t('TRAININGS.COURSE_URI'),
        startDate: TRANSLATE.t('TRAININGS.START_DATE'),
        endDate: TRANSLATE.t('TRAININGS.END_DATE'),
        supportDocument: TRANSLATE.t("DOC_SUPPORT.UPLOAD_DOCUMENT"),
      };
      dispatch(addLiveTraining(formData));
    }
  }

  const deleteDoc = (docsData) => {
    dispatch(deleteDocument({ type: docsData.type, id: docsData.id }));
  };

  const { handleSubmit } = props;
  return (
    <div>
      <Modal
        className='account-pages my-5 pt-sm-5'
        isOpen={props.isOpen}
        toggle={toggle}
        size={'lg'}
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
                          className={'bx bx-chalkboard mr-3 ml-1'}
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
                  <div className='form-group'>
                    <AvField
                      name='title'
                      tag={Field}
                      component={renderTextField}
                      label={TRANSLATE.t('ANNOUNCEMENT.TITLE')}
                      className='form-control'
                      placeholder={TRANSLATE.t('ANNOUNCEMENT.ENTER_TITLE')}
                      type='text'
                      disabled = {eventType === "view" ? true : false}
                      validate={{
                        required: {
                          value: initialValues ? false : true,
                          errorMessage: TRANSLATE.t('ERRORS.REQUIRED'),
                        },
                      }}
                    />
                  </div>
                  {/* <div className="form-group">
                    <Label>{TRANSLATE.t("TRAININGS.CHOOSE_MODULES")}</Label>
                    <Field
                      name="moduleId"
                      component={renderSelectField}
                      className="form-control"
                      placeholder={
                        selectedModule[0]?.label ||
                        TRANSLATE.t("TRAININGS.CHOOSE_MODULES")
                      }
                      disabled = {eventType === "view" ? true : false}
                      options={
                        modulesList && modulesList.length
                          ? renderOptions(modulesList, "label", "value")
                          : []
                      }
                    />
                  </div> */}
                  <div className='form-group'>
                    <AvField
                      name='courseURI'
                      tag={Field}
                      component={renderTextField}
                      label={TRANSLATE.t('TRAININGS.COURSE_URI')}
                      className='form-control'
                      placeholder={TRANSLATE.t('TRAININGS.COURSE_URI')}
                      type='text'
                      disabled = {eventType === "view" ? true : false}
                    />
                  </div>
                  <Row>
                    <Col>
                      <div className='form-group'>
                        <Label>{TRANSLATE.t('TRAININGS.START_DATE')}</Label>
                        <Field
                          name='startDate'
                          component={renderDatePicker}
                          placeholder={TRANSLATE.t('TRAININGS.START_DATE')}
                          onChange={(e) => handleChange(true, e)}
                          selectedValue={startDate}
                          dateFormat={'MMMM d, yyyy h:mm aa'}
                          showTimeSelect={true}
                          disabled = {eventType === "view" ? true : false}
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className='form-group'>
                        <Label>{TRANSLATE.t('TRAININGS.END_DATE')}</Label>
                        <Field
                          name='endDate'
                          component={renderDatePicker}
                          placeholder={TRANSLATE.t('TRAININGS.END_DATE')}
                          onChange={(e) => handleChange(false, e)}
                          selectedValue={endDate}
                          dateFormat={'MMMM d, yyyy h:mm aa'}
                          showTimeSelect={true}
                          startDate={startDate}
                          minDate={startDate}
                          maxDate={startDate}
                          minTime={new Date(startDate).setMinutes(15)}
                          maxTime={new Date(startDate).setMinutes(120)}
                          timeIntervals={15}
                          readOnly={startDate ? false : true}
                             disabled = {eventType === "view" ? true : false}
                        />
                      </div>
                    </Col>
                  </Row>

                  {docsData.length ? (
                    <Row>
                      <Col lg={4} className={'imgContainerStyle ml-3'}>
                        <div>
                          <a
                            href={`${BASE_URL}/documents/download/${initialValues.documents[0].type}/${initialValues.documents[0].id}`}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <span className='float-left'>
                                {initialValues.documents[0].type && documentTypesData[initialValues.documents[0].type]}
                              </span>
                          </a>
                          {eventType !== "view" &&<div>
                            <div className='pt-2'>
                              <span
                                className='float-right'
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                  deleteDoc(initialValues.documents[0])
                                }
                              >
                                <h4 className={'text-danger'}>
                                  <i className='bx bxs-trash-alt' />
                                </h4>
                              </span>
                            </div>
                          </div>}
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <div className="form-group">
                      <Label>{TRANSLATE.t("DOC_SUPPORT.UPLOAD_DOCUMENT")}</Label>
                      <div className="custom-file reduce-height">
                        <Dropzone
                          handleChange={handleFileChange}
                          isShowPreview={false}
                          toggle={onFileDelete}
                          showPreviewsInDropzone={true}
                          acceptedFiles={['application/pdf']}
                          filesLimit={1}
                          preViewText={"Vue document"}
                        />
                      </div>
                    </div>
                  )}
                </CardBody>
                <div className='modal-footer'>
                  {eventType !== "view" &&(<button
                    className='btn btn-primary  waves-effect waves-light'
                    type='submit'
                    // disabled={pristine || submitting}
                  >
                    {eventType === 'add'
                      ? TRANSLATE.t('ANNOUNCEMENT.ADD')
                      : TRANSLATE.t('ANNOUNCEMENT.SUBMIT')}
                  </button>)}
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

AddDistanceTraining.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  callApi: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  apiType: PropTypes.string.isRequired,
  eventType: PropTypes.string,
  initialValues: PropTypes.object,
};

export default reduxForm({
  form: 'AddDistanceTraining',
})(AddDistanceTraining);
