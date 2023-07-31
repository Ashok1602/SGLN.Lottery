import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
//react-redux
import { useSelector, useDispatch } from 'react-redux';
import { uploadDocument } from '../../store/actions';
// availity-reactstrap-validation
import { AvForm } from 'availity-reactstrap-validation';
//constants
import { TRANSLATE, MAX_FILE_SIZE } from '../../constants';
import { Row, Col, CardBody, Container, Label, Modal, Input, FormGroup } from 'reactstrap';
import Dropzone from '../../components/common/Dropzone';

const UploadDocModal = (props) => {
  const [selectedFile, updateFile] = useState(null);
  const [docType, setDocType] = useState(null);
  const { title, callApi, documentType } = props;
  const dispatch = useDispatch();

  //for toggle modal
  const toggle = () => {
    props.handleModal();
  };
  //for submit form
  function onSubmit() {
    if (selectedFile) {
      const data = {
        imgData: {
          data: selectedFile,
          fileName: selectedFile.name,
        },
        type: docType,
        spec: 'None',
      };
      dispatch(uploadDocument(data));
    }
  }

  /*------handling api data---------*/
  const nextProps = useSelector((state) => ({
    data: state.Documents.createData,
  }));
  const mount = useRef(() => {
    toggle();
    callApi();
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

  const handleFileChange = (files) => {
    if (files[0]) {
      if (files[0] && files[0].size <= MAX_FILE_SIZE) {
        updateFile(files[0]);
      }
      //  else {
      //  // throw error
      // }
    }
  };
  const onFileDelete = () => {
    updateFile(null);
  };

  return (
    <div>
      <Modal
        className='account-pages my-5 pt-sm-5'
        isOpen={props.isOpen}
        toggle={toggle}
      >
        <Container>
          <Row className='justify-content-center'>
            <Col style={{ padding: '0' }}>
              <AvForm className='form-horizontal'>
                <div className='bg-soft-primary'>
                  <Row>
                    <Col>
                      <div className='modal-header bg-soft-primary'>
                      <i
                          className={'bx bxs-file-plus mr-3 ml-1'}
                          style={{ fontSize: '25px' }}
                        ></i>
                        <h5 className='mt-auto text-white'>{title}</h5>
                        <button
                          type='button'
                          className='close'
                          data-dismiss='modal'
                          onClick={toggle}
                        >
                          <span aria-hidden='true' className='close-button'>
                            &times;
                          </span>
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody>
                <div className="form-group">
                  <FormGroup tag="fieldset" onChange={(e) => setDocType(e.target.value)}>
                  <Label>{TRANSLATE.t("DOC_SUPPORT.SELECT_DOC_TYPE")}</Label>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="type" value={"OfficialDocument"} />
                        {documentType["OfficialDocument"]}
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="type" value={"OfficialRessource"} />
                        {documentType["OfficialRessource"]}
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="type" value={"ToolboxDocument"} />
                        {documentType["ToolboxDocument"]}
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" name="type" value={"MediaLibraryDocument"} />
                        {documentType["MediaLibraryDocument"]}
                      </Label>
                    </FormGroup>
                  </FormGroup>
                </div>
                  <div className='form-group'>
                    <Label>{TRANSLATE.t('ANNOUNCEMENT.DOCUMENTS')}</Label>
                    <div className='custom-file reduce-height'>
                      <Dropzone
                        handleChange={handleFileChange}
                        isShowPreview={false}
                        toggle={onFileDelete}
                        showPreviewsInDropzone={true}
                        // acceptedFiles={['image/jpeg', 'image/jpg', 'image/png',]}
                        filesLimit={1}
                      />
                    </div>
                  </div>
                </CardBody>
                <div className='modal-footer'>
                  <button
                    className='btn btn-primary  waves-effect waves-light'
                    onClick={onSubmit}
                  >
                    {TRANSLATE.t('ANNOUNCEMENT.SUBMIT')}
                  </button>
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

UploadDocModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func,
  callApi: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  documentType: PropTypes.object.isRequired
};

export default UploadDocModal;
