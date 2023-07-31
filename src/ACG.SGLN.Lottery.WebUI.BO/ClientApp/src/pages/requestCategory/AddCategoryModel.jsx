import React, { useEffect, useRef, useState,useCallback } from "react";
import PropTypes from "prop-types";
import ReactCrop from 'react-image-crop';
//react-redux
import { useSelector, useDispatch } from "react-redux";
import { createCategory, updateCategory } from "../../store/actions";
// reduxform
import { reduxForm, Field } from "redux-form";
import { renderTextField,renderSelectField } from "../../components/common/RenderTextField";
// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
//constants
import { TRANSLATE, MAX_FILE_SIZE } from "../../constants";
import { Row, Col, CardBody, Container, Label, Modal } from "reactstrap";
import Dropzone from "../../components/common/Dropzone";
import { BASE_URL } from "../../actions/config";
import { renderOptions,base64StringtoFile,
  extractImageFileExtensionFromBase64,} from '../../helpers';

const AddCategoryModel = (props) => {
  const { title, apiType, callApi, eventType, initialValues, natureTypes } = props;
  const [selectedFile, updateFile] = useState(null);
  const [documentId, setDocumentId] = useState(initialValues?.id);

  const [upImg, setUpImg] = useState('');
  const [imgSrcExt, setImgSrcExt] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: '%',
 width: 50, height: 50 });
  const [completedCrop, setCompletedCrop] = useState(null);
  
  const documentTypesData = JSON.parse(
    localStorage.getItem("resourceInfo") || "{}"
  ).DocumentType;

  const dispatch = useDispatch();

  const onSelectFile = (files) => {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setUpImg(reader.result);
        setImgSrcExt(extractImageFileExtensionFromBase64(reader.result));
      });
      reader.readAsDataURL(files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
    if (img.width > img.height) {
      setCrop({...crop, width:50, height: 100})
    } else if (img.height > img.width) {
      setCrop({...crop, height:50, width: 100})
    } else if (img.height === img.width) {
      setCrop({...crop, height:100, width: 100})
    }
    return false;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  //for toggle modal
  const toggle = () => {
    props.handleModal();
  };
  //for submit form
  function onSubmit(formData) {
    let myNewCroppedFile = null;
    if (upImg) {
      const canvasRef = previewCanvasRef.current;
      const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt);
      const myFilename = selectedFile.name;
      myNewCroppedFile = base64StringtoFile(imageData64, myFilename);
    }

    if (myNewCroppedFile) {
      formData.coverImage = {
        data: myNewCroppedFile,
        fileName: myNewCroppedFile.name,
      };
    }
    if (formData.id) {
      dispatch(updateCategory(formData));
    } else {
      formData.requiredKeys = {
        title: TRANSLATE.t("ANNOUNCEMENT.TITLE"),
        coverImage: TRANSLATE.t("ANNOUNCEMENT.DOCUMENTS"),
      };
      dispatch(createCategory(formData));
    }
  }

  /*------handling api data---------*/
  const nextProps = useSelector((state) => ({
    data: state.RequestCategory.createData || state.RequestCategory.updateData,
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

  const handleFileChange = (files) => {
    if (files[0]) {
      if (files[0] && files[0].size <= MAX_FILE_SIZE) {
        updateFile(files[0]);
        onSelectFile(files);
      }
      //  else {
      //  // throw error
      // }
    }
  };
  const onFileDelete = () => {
    updateFile(null);
  };

  const { handleSubmit } = props;
  return (
    <div>
      <Modal
        className="account-pages my-5 pt-sm-5"
        isOpen={props.isOpen}
        toggle={toggle}
        size='lg'
      >
        <Container>
          <Row className="justify-content-center">
            <Col style={{ padding: "0" }}>
              <AvForm
                className="form-horizontal"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="bg-soft-primary">
                  <Row>
                    <Col>
                      <div className="modal-header bg-soft-primary">
                        <i
                          className={"bx bx-news mr-3 ml-1"}
                          style={{ fontSize: "25px" }}
                        ></i>
                        <h5 className="mt-auto text-white">{title}</h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          onClick={toggle}
                        >
                          <span
                            aria-hidden="true"
                            className="close-button text-white"
                          >
                            &times;
                          </span>
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody>
                  <div className="form-group">
                    <Label>Nature</Label>
                    <Field
                      name="requestNature"
                      component={renderSelectField}
                      className="form-control"
                      placeholder="Select Nature"
                      // defaultValue = "test"
                      options={
                        natureTypes && natureTypes.length
                          ? renderOptions(natureTypes, "label", "value")
                          : []
                      }
                    />
                  </div>
                  <div className="form-group">
                    <AvField
                      name="title"
                      tag={Field}
                      component={renderTextField}
                      label={TRANSLATE.t("ANNOUNCEMENT.TITLE")}
                      className="form-control"
                      placeholder={TRANSLATE.t("ANNOUNCEMENT.ENTER_TITLE")}
                      type="text"
                      validate={{
                        required: {
                          value: initialValues ? false : true,
                          errorMessage: TRANSLATE.t("ERRORS.REQUIRED"),
                        },
                      }}
                    />
                  </div>
                  <div className="form-group">
                    {documentId ? (
                      <Row>
                        <Col lg={4} className={"imgContainerStyle ml-3"}>
                          <div>
                            <a
                              href={`${BASE_URL}/documents/download/${initialValues.type}/${documentId}`}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <img
                                className='slides-img w-100'
                                src={`${BASE_URL}/documents/download/${initialValues.type}/${documentId}`}
                                alt={
                                  initialValues.type &&
                                  documentTypesData[initialValues.type]
                                }
                              />
                            </a>

                            <div className='py-2 text-center'>
                              <span
                                className={'text-danger'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setDocumentId(null);
                                }}
                              >
                                supprimer
                              </span>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    ) : (
                      <div className="form-group">
                        <Label>{TRANSLATE.t("ANNOUNCEMENT.DOCUMENTS")}</Label>
                        <div className="custom-file reduce-height" style={{}}>
                          <Dropzone
                            handleChange={handleFileChange}
                            isShowPreview={false}
                            toggle={onFileDelete}
                            showPreviewsInDropzone={false}
                            acceptedFiles={[
                              "image/jpeg",
                              "image/jpg",
                              "image/png",
                              "image/bmp",
                            ]}
                            filesLimit={1}
                            preViewText={"Vue document"}
                          />
                        </div>
                        <Row>
                          <Col>
                            <ReactCrop
                              src={upImg}
                              onImageLoaded={onLoad}
                              crop={crop}
                              onChange={(c) => setCrop(c)}
                              onComplete={(c) => setCompletedCrop(c)}
                              locked
                            />
                          </Col>
                          <Col>
                            <canvas
                              ref={previewCanvasRef}
                              // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                              style={{
                                width: Math.round(completedCrop?.width ?? 0),
                                height: Math.round(completedCrop?.height ?? 0),
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>
                </CardBody>
                <div className="modal-footer">
                  <button
                    className="btn btn-primary  waves-effect waves-light"
                    type="submit"
                    // disabled={pristine || submitting}
                  >
                    {eventType === "add"
                      ? TRANSLATE.t("ANNOUNCEMENT.ADD")
                      : TRANSLATE.t("ANNOUNCEMENT.SUBMIT")}
                  </button>
                  &ensp;
                  <button
                    className="btn btn-secondary  waves-effect waves-light"
                    type="submit"
                    onClick={toggle}
                  >
                    {TRANSLATE.t("ANNOUNCEMENT.BACK")}
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

AddCategoryModel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  callApi: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  apiType: PropTypes.string.isRequired,
  eventType: PropTypes.string,
  natureTypes: PropTypes.array.isRequired,
  initialValues: PropTypes.object,
};

export default reduxForm({
  form: "AddCategoryModel",
})(AddCategoryModel);
