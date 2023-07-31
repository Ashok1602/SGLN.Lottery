import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import queryString from "query-string";
import {
  getTrainingById,
  getStrippedModules,
  addInteractiveTraining,
  getTrainingSlidesById,
  getTrainingQuestionsById,
  updateInteractiveTraining,
} from "../../../store/actions";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { GlobalNotificationHandle } from "../../../services/NotificationHandler";
import interactiveTrainingDetails from "../../../assets/images/interactive-training-details.png";
import { TRANSLATE, MAX_FILE_SIZE } from "../../../constants";
import BackButton from "../../../components/common/BackButton";
import { renderOptions } from "../../../helpers";
import { useDispatch, useSelector, connect } from "react-redux";
import compose from "compose-function";
import classnames from "classnames";
import MultipleChoiceComponent from "./MultipleChoiceComponent";
import SlidesComponent from "./SlidesComponent";
import { reduxForm, Field } from "redux-form";
import {
  renderTextField,
  renderSelectField,
} from "../../../components/common/RenderTextField";

let InteractiveTrainingDetails = (props) => {
  const { id } = queryString.parse(props.location.search);
  const { handleSubmit } = props;
  const [modulesList, setModulesList] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [questionsList, setQuestionsList] = useState([]);
  const [slideList, setSlideList] = useState([]);
  const [initialValues, setinitialValues] = useState({});
  const dispatch = useDispatch();
  const nextProps = useSelector((state) => ({
    strippedModules: state.TrainingModule.data,
    trainingDetails: state.Trainings.dataById,
    trainingAdded:
      state.Trainings.addInteractiveTrainingData ||
      state.Trainings.editInteractiveTrainingData,
    questionList: state.Trainings.questionList,
    slidesList: state.Trainings.slidesList,
  }));
  useEffect(() => {
    dispatch(getStrippedModules());
    if (id) {
      dispatch(getTrainingById(id));
      dispatch(getTrainingSlidesById(id));
      dispatch(getTrainingQuestionsById(id));
    }
  }, [dispatch, id]);
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
    if (nextProps.trainingDetails && nextProps.trainingDetails.data) {
      setinitialValues(nextProps.trainingDetails.data);
    }
  }, [nextProps.trainingDetails]);

  const getSlides = useRef(true);
  useEffect(() => {
    if (getSlides.current) {
      getSlides.current = false;
      return;
    }
    if (
      nextProps.slidesList &&
      nextProps.slidesList.data &&
      nextProps.slidesList.data.listTrainingCourseSlide
    ) {
      setSlideList(
        nextProps.slidesList.data.listTrainingCourseSlide.map((data, key) => {
          let result = { body: data.body, id: key + 1 };
          if (initialValues?.documents) {
            result.image = (initialValues?.documents || [])[key]?.data || "";
          }
          return result;
        })
      );
    }
  }, [nextProps.slidesList, initialValues]);
  const getQuestions = useRef(true);
  useEffect(() => {
    if (getQuestions.current) {
      getQuestions.current = false;
      return;
    }
    if (
      nextProps.questionList &&
      nextProps.questionList.data &&
      nextProps.questionList.data.length
    ) {
      setQuestionsList(
        nextProps.questionList.data.map((data, key) => {
          let correctOptionIndex = null;
          let options = data.options.map((option, key) => {
            if (option.isCorrect) {
              correctOptionIndex = key;
            }
            return option.label;
          });
          return {
            label: data.label,
            correctOptionIndex,
            options,
            id: key + 1,
          };
        })
      );
    }
  }, [nextProps.questionList]);
  const isAdded = useRef(true);
  useEffect(() => {
    if (isAdded.current) {
      isAdded.current = false;
      return;
    }
    if (nextProps.trainingAdded && nextProps.trainingAdded.data) {
      props.history.push("/interactiveTraining");
    }
  }, [nextProps.trainingAdded, props.history]);

  const handleAddFields = (isQuestion) => {
    if (isQuestion) {
      setQuestionsList([
        ...questionsList,
        {
          label: "",
          correctOptionIndex: null,
          options: [],
          id: questionsList.length ? questionsList.length + 1 : 1,
        },
      ]);
      return;
    }
    setSlideList([
      ...slideList,
      {
        image: "",
        body: "",
        id: slideList.length ? slideList.length + 1 : 1,
      },
    ]);
  };
  const handleRemoveFields = (key, isQuestion) => {
    if (isQuestion) {
      return setQuestionsList(
        questionsList.filter((data, index) => index !== key)
      );
    }
    setSlideList(slideList.filter((data, index) => index !== key));
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const handleFileChange = async (files, key) => {
    if (files[0] && files[0].size <= MAX_FILE_SIZE) {
      let items = [...slideList];
      let item = { ...slideList[key] };
      await getBase64(files[0], item);
      items[key] = item;
      setSlideList(items);
    }
  };
  const onFileDelete = (key) => {
    let items = [...slideList];
    let item = { ...slideList[key] };
    item.image = "";
    items[key] = item;
    setSlideList(items);
  };
  async function getBase64(file, item) {
    var reader = new FileReader();
    await reader.readAsDataURL(file);
    reader.onload = async function () {
      await reader.result;
      item.image =
        reader.result.split("data:image/png;base64,")[1] ||
        reader.result.split("data:image/jpeg;base64,")[1];
    };
  }

  const deleteDoc = (docIndex) => {
    let initialData = JSON.parse(JSON.stringify(initialValues)); 
    initialData.documents[docIndex] = null;
    setinitialValues(initialData);
    let slideListData =  JSON.parse(JSON.stringify(slideList));  
    slideListData[docIndex].image = "";
    setSlideList(slideListData);
  };

  function onSubmit(formData) {
    let isInvalid = false;
    if (!slideList.length || !questionsList.length) {
      return GlobalNotificationHandle(
        400,
        !questionsList.length
          ? TRANSLATE.t("TRAININGS.ADD_QUESTION_VALIDATION")
          : TRANSLATE.t("TRAININGS.ADD_SLIDES_VALIDATION")
      );
    }
    formData.courseSlides = slideList.map((data, key) => {
      let lastValue = isInvalid;
      isInvalid = !data.image
        ? TRANSLATE.t("TRAININGS.ATTATCH_IMAGE_VALIDATION")
        : !data.body
        ? TRANSLATE.t("TRAININGS.ADD_DESCRIPTION_VALIDATION")
        : isInvalid;
      if (lastValue !== isInvalid) {
        GlobalNotificationHandle(400, isInvalid);
      }
      data.order = key + 1;
      return data;
    });
    formData.courseQuestions = questionsList.map((data) => {
      let lastValue = isInvalid;
      isInvalid = !data.label
        ? TRANSLATE.t("TRAININGS.ADD_QUESTION_TITLE")
        : data.options.length < 4
        ? TRANSLATE.t("TRAININGS.ADD_QUESTION_OPTIONS")
        : (data.correctOptionIndex === null
        ? TRANSLATE.t("TRAININGS.SELECT_ANS")
        : isInvalid);
      if (lastValue !== isInvalid) {
        GlobalNotificationHandle(400, isInvalid);
      }
      return data;
    });
    if (isInvalid) {
      return null;
    }
    if (id) {
      formData.id = id;
      if (!formData.moduleId) {
        formData.moduleId = initialValues.moduleId;
      }
      dispatch(updateInteractiveTraining(formData));
    } else {
      formData.requiredKeys = {
        title: TRANSLATE.t("ANNOUNCEMENT.TITLE"),
        moduleId: TRANSLATE.t("TRAININGS.CHOOSE_MODULES"),
        description: TRANSLATE.t("ANNOUNCEMENT.DESCRIPTION"),
      };
      dispatch(addInteractiveTraining(formData));
    }
  }
  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col className="align-middle" xl="10">
            <div className="d-flex float-left mb-3">
              <div className="mr-4 mt-4">
                <BackButton />
              </div>
              <img
                className="mr-2"
                src={interactiveTrainingDetails}
                alt="headerImg"
                width="75px"
                height="75px"
              />
              <h3 className="title">
                {TRANSLATE.t("TRAININGS.INTERACTIVE_TRAINING")}
              </h3>
            </div>
          </Col>
          <Col>
            <Button
              className="retailer-drop-down-button bg-secondary text-white"
              size="lg"
              onClick={handleSubmit(onSubmit)}
            >
              {id ? TRANSLATE.t("SUBMIT") : TRANSLATE.t("TRAININGS.SAVE")}
            </Button>
          </Col>
        </Row>
        <AvForm className="form-horizontal" noValidate>
          <Card className="mt-3" style={{ borderRadius: "28px" }}>
            <CardBody className="mt-1">
              <Row>
                <Col xl="8">
                  <AvField
                    name="title"
                    tag={Field}
                    component={renderTextField}
                    label={TRANSLATE.t("ANNOUNCEMENT.TITLE")}
                    className="form-control p-2 field-style"
                    placeholder={
                     TRANSLATE.t("ANNOUNCEMENT.ENTER_TITLE")
                    }
                    type="text"
                    validate={{
                      required: {
                        value: id ? false : true,
                        errorMessage: TRANSLATE.t("ERRORS.REQUIRED"),
                      },
                    }}
                  />
                </Col>
                <Col xl="4">
                  <Label>{TRANSLATE.t("TRAININGS.CHOOSE_MODULES")}</Label>
                  <Field
                    name="moduleId"
                    component={renderSelectField}
                    className="form-control p-2 field-style"
                    placeholder={
                     TRANSLATE.t("TRAININGS.CHOOSE_MODULES")
                    }
                    options={
                      modulesList && modulesList.length
                        ? renderOptions(modulesList, "label", "value")
                        : []
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <AvField
                    name="description"
                    tag={Field}
                    component={renderTextField}
                    label={TRANSLATE.t("ANNOUNCEMENT.DESCRIPTION")}
                    className="form-control p-2 field-style"
                    placeholder={
                      TRANSLATE.t("ANNOUNCEMENT.ENTER_DESCRIPTION")
                    }
                    validate={{
                      required: {
                        value: id ? false : true,
                        errorMessage: TRANSLATE.t("ERRORS.REQUIRED"),
                      },
                    }}
                    type="textarea"
                    rows="5"
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Card className="mt-3" style={{ borderRadius: "28px" }}>
            <CardBody className="mt-1">
              <Nav tabs className="nav-tabs-custom">
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      toggleTab("1");
                    }}
                    className={classnames({ active: activeTab === "1" })}
                  >
                    <span className="d-none d-sm-block">
                      {TRANSLATE.t("TRAININGS.SLIDES")}
                    </span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      toggleTab("2");
                    }}
                    className={classnames({ active: activeTab === "2" })}
                  >
                    <span className="d-none d-sm-block">
                      {TRANSLATE.t("TRAININGS.MULTIPLE_CHOICE")}
                    </span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab} className="mt-2 ml-2 mr-2">
                <TabPane tabId="1">
                  <SlidesComponent
                    slideListData={slideList}
                    setSlideList={setSlideList}
                    handleRemoveFields={handleRemoveFields}
                    id={id}
                    handleAddFields={handleAddFields}
                    initialValuesData={initialValues}
                    handleFileChange={handleFileChange}
                    deleteDoc={deleteDoc}
                    onFileDelete={onFileDelete}
                  />
                </TabPane>
                <TabPane tabId="2" className="mt-2 ml-2 mr-2">
                  <MultipleChoiceComponent
                    questionsList={questionsList}
                    setQuestionsList={setQuestionsList}
                    handleRemoveFields={handleRemoveFields}
                    id={id}
                    handleAddFields={handleAddFields}
                  />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </AvForm>
      </Container>
    </div>
  );
}

InteractiveTrainingDetails.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

InteractiveTrainingDetails = reduxForm({
  form: "InteractiveTrainingDetails",
  enableReinitialize: true,
})(InteractiveTrainingDetails);

const mapStateToProps = (state) => {
  const initialValues = {
    title: state.Trainings.dataById ? state.Trainings.dataById.data.title : "",
    description: state.Trainings.dataById ? state.Trainings.dataById.data.description : "",
    moduleId: state.Trainings.dataById ? state.Trainings.dataById.data.moduleId : ""
  };
  return { initialValues: initialValues };
};
export default compose(connect(mapStateToProps))(InteractiveTrainingDetails);