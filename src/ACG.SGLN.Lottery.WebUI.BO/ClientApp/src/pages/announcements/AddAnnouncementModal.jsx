import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
//react-redux
import { useSelector, useDispatch } from "react-redux";
import { addAnnouncement, updateAnnouncement } from "../../store/actions";
// reduxform
import { reduxForm, Field } from "redux-form";
import { renderTextField } from "../../components/common/RenderTextField";
// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
//constants
import { TRANSLATE, MAX_FILE_SIZE } from "../../constants";
import { Row, Col, CardBody, Container, Label, Modal } from "reactstrap";
import Dropzone from "../../components/common/Dropzone";

const AddAnnouncement = (props) => {
  const [selectedFile, updateFile] = useState(null);
  const { title, apiType, callApi, eventType } = props;
  const dispatch = useDispatch();

  //for toggle modal
  const toggle = () => {
    props.handleModal();
  };
  //for submit form
  function onSubmit(formData) {
    if (formData.id) {
      dispatch(updateAnnouncement(formData));
    } else {
      if (selectedFile) {
        formData.coverImage = {
          data: selectedFile,
          fileName: selectedFile.name,
        };
      }
      formData.requiredKeys = {
        title: TRANSLATE.t("ANNOUNCEMENT.TITLE"),
        body: TRANSLATE.t("ANNOUNCEMENT.DESCRIPTION"),
        coverImage: TRANSLATE.t("ANNOUNCEMENT.DOCUMENTS"),
      };
      dispatch(addAnnouncement(formData));
    }
  }

  /*------handling api data---------*/
  const nextProps = useSelector((state) => ({
    data: state.Announcement.createData || state.Announcement.updateData,
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
                          value: true,
                          errorMessage: TRANSLATE.t("ERRORS.REQUIRED"),
                        },
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <AvField
                      name="body"
                      tag={Field}
                      component={renderTextField}
                      label={TRANSLATE.t("ANNOUNCEMENT.DESCRIPTION")}
                      className="form-control"
                      placeholder={TRANSLATE.t(
                        "ANNOUNCEMENT.ENTER_DESCRIPTION"
                      )}
                      type="textarea"
                      rows={8}
                      validate={{
                        required: {
                          value: true,
                          errorMessage: TRANSLATE.t("ERRORS.REQUIRED"),
                        },
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <Label>{TRANSLATE.t("ANNOUNCEMENT.DOCUMENTS")}</Label>
                    <div className="custom-file reduce-height">
                      <Dropzone
                        handleChange={handleFileChange}
                        isShowPreview={false}
                        toggle={onFileDelete}
                        showPreviewsInDropzone={true}
                        acceptedFiles={["image/jpeg", "image/jpg", "image/png"]}
                        // className={classes.dropZone}
                        filesLimit={1}
                      />
                    </div>
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

AddAnnouncement.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  callApi: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  apiType: PropTypes.string.isRequired,
  eventType: PropTypes.string,
};

export default reduxForm({
  form: "AddAnnouncement",
})(AddAnnouncement);
