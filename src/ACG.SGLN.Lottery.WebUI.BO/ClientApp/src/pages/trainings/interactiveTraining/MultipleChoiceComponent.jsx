import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  Row,
  Label,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
} from "reactstrap";
import { TRANSLATE } from "../../../constants";
import { ReactSortable } from "react-sortablejs";
import dragImg from "../../../assets/images/drag-img.png";
import addDocImg from "../../../assets/images/add-doc-img.png";
const MultipleChoiceComponent = (props) => {
  const {
    questionsList,
    setQuestionsList,
    handleRemoveFields,
    id,
    handleAddFields,
  } = props;
  return (
    <>
      <ReactSortable id="2" list={questionsList} setList={setQuestionsList}>
        {questionsList.map((field, key) => (
          <Fragment key={field.id || key}>
            <div key={field.id || key}>
              {key !== 0 && <hr></hr>}
              <Row className="mt-3">
                <span
                  style={{
                    background: "#EBEBEB",
                    borderRadius: "4px",
                    padding: "2px 5px",
                  }}
                >
                  {key + 1}
                </span>
                <Label className="ml-2">
                  {TRANSLATE.t("TRAININGS.QUESTION")}
                </Label>
              </Row>
              <Row className="mt-3">
                <Col xl="11">
                  <input
                    type="text"
                    className="form-control p-2 field-style"
                    defaultValue={field.label}
                    placeholder={
                      id ? field.label : TRANSLATE.t("TRAININGS.ENTER_QUESTION")
                    }
                    onChange={(value) => {
                      let items = [...questionsList];
                      let item = { ...questionsList[key] };
                      item.label = value.target.value;
                      items[key] = item;
                      setQuestionsList(items);
                    }}
                  />
                </Col>
                <Col xl="1">
                  <div>
                    <button
                      color="primary"
                      className="btn btn-danger"
                      onClick={() => {
                        handleRemoveFields(key, true);
                      }}
                    >
                      <i className="far fa-trash-alt"></i>
                    </button>
                    <img
                      className="ml-4"
                      style={{
                        cursor: "grab",
                      }}
                      src={dragImg}
                      alt="dragImg"
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText className="question-radio-button">
                        <Input
                          addon
                          type="radio"
                          name={`question ${key}`}
                          value="1"
                          defaultChecked={
                            field.correctOptionIndex === 0 ? true : false
                          }
                          onClick={() => {
                            let items = [...questionsList];
                            let item = { ...questionsList[key] };
                            item.correctOptionIndex = 0;
                            items[key] = item;
                            setQuestionsList(items);
                          }}
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      className="p-2 field-style"
                      placeholder={
                        id
                          ? field.options[0] || "N/A"
                          : TRANSLATE.t("TRAININGS.ENTER_OPTIONS")
                      }
                      defaultValue={field.options[0]}
                      onChange={(value) => {
                        let items = [...questionsList];
                        let item = { ...questionsList[key] };
                        item.options[0] = value.target.value;
                        items[key] = item;
                        setQuestionsList(items);
                      }}
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText className="question-radio-button">
                        <Input
                          addon
                          type="radio"
                          name={`question ${key}`}
                          value="2"
                          defaultChecked={
                            field.correctOptionIndex === 1 ? true : false
                          }
                          onClick={() => {
                            let items = [...questionsList];
                            let item = { ...questionsList[key] };
                            item.correctOptionIndex = 1;
                            items[key] = item;
                            setQuestionsList(items);
                          }}
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      className="p-2 field-style"
                      placeholder={
                        id
                          ? field.options[1] || "N/A"
                          : TRANSLATE.t("TRAININGS.ENTER_OPTIONS")
                      }
                      defaultValue={field.options[1]}
                      onChange={(value) => {
                        let items = [...questionsList];
                        let item = { ...questionsList[key] };
                        item.options[1] = value.target.value;
                        items[key] = item;
                        setQuestionsList(items);
                      }}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText className="question-radio-button">
                        <Input
                          addon
                          type="radio"
                          name={`question ${key}`}
                          value="3"
                          defaultChecked={
                            field.correctOptionIndex === 2 ? true : false
                          }
                          onClick={() => {
                            let items = [...questionsList];
                            let item = { ...questionsList[key] };
                            item.correctOptionIndex = 2;
                            items[key] = item;
                            setQuestionsList(items);
                          }}
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      className="p-2 field-style"
                      placeholder={
                        id
                          ? field.options[2] || "N/A"
                          : TRANSLATE.t("TRAININGS.ENTER_OPTIONS")
                      }
                      defaultValue={field.options[2]}
                      onChange={(value) => {
                        let items = [...questionsList];
                        let item = { ...questionsList[key] };
                        item.options[2] = value.target.value;
                        items[key] = item;
                        setQuestionsList(items);
                      }}
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText className="question-radio-button">
                        <Input
                          addon
                          type="radio"
                          name={`question ${key}`}
                          value="4"
                          defaultChecked={
                            field.correctOptionIndex === 3 ? true : false
                          }
                          onClick={() => {
                            let items = [...questionsList];
                            let item = { ...questionsList[key] };
                            item.correctOptionIndex = 3;
                            items[key] = item;
                            setQuestionsList(items);
                          }}
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      className="p-2 field-style"
                      placeholder={
                        id
                          ? field.options[3] || "N/A"
                          : TRANSLATE.t("TRAININGS.ENTER_OPTIONS")
                      }
                      defaultValue={field.options[3]}
                      onChange={(value) => {
                        let items = [...questionsList];
                        let item = { ...questionsList[key] };
                        item.options[3] = value.target.value;
                        items[key] = item;
                        setQuestionsList(items);
                      }}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </div>
          </Fragment>
        ))}
      </ReactSortable>
      <Row>
        <div className="add-slides-qustions ml-2 mt-3">
          <button
            onClick={() => {
              handleAddFields(true);
            }}
          >
            <img src={addDocImg} alt="addSlidesImg" className="mr-2" />
            {TRANSLATE.t("TRAININGS.ADD_NEW_QUESTION")}
          </button>
        </div>
      </Row>
    </>
  );
};

MultipleChoiceComponent.propTypes = {
  questionsList: PropTypes.array.isRequired,
  setQuestionsList: PropTypes.func.isRequired,
  handleRemoveFields: PropTypes.func.isRequired,
  id: PropTypes.string,
  handleAddFields: PropTypes.func.isRequired,
};
export default MultipleChoiceComponent;
