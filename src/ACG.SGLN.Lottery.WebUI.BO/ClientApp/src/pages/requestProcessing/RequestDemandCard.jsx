import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, CardSubtitle } from "reactstrap";
import { TRANSLATE } from "../../constants";
import natureIcon from "../../assets/images/nature.png";
import categoryIcon from "../../assets/images/category.png";
import objectIcon from "../../assets/images/object.png";
import eventOrange from "../../assets/images/event-orange.png";
const RequestDemandCard = (props) => {
  const requestNatureTypeData = JSON.parse(
    localStorage.getItem("resourceInfo") || "{}"
  ).RequestNatureType;
  return (
    <>
      <React.Fragment>
        <Card className="request-card-data">
          <CardBody>
            {props.imageHeaderComponent(natureIcon, TRANSLATE.t("REQUESTS.NATURE_REQUEST"))}
            <CardSubtitle tag="h3" className="card-sub-title">
              {props.requestNature ? requestNatureTypeData[props.requestNature] : ""}
            </CardSubtitle>
          </CardBody>
        </Card>
      </React.Fragment>
      <React.Fragment>
        <Card className="request-card-data">
          <CardBody>
            {props.imageHeaderComponent(categoryIcon, TRANSLATE.t("REQUESTS.CATEGORY_REQUEST"))}
            <CardSubtitle tag="h3" className="card-sub-title">
              {props.requestCategory ? props.requestCategory.title : ""}
            </CardSubtitle>
          </CardBody>
        </Card>
      </React.Fragment>
      <React.Fragment>
        <Card className="request-card-data">
          <CardBody>
            {props.imageHeaderComponent(objectIcon, TRANSLATE.t("REQUESTS.REQUEST_SUBJECT"))}
            <CardSubtitle tag="h3" className="card-sub-title">
              {props.requestObject
                ? props.requestObject.split("|")[1] || ""
                : ""}
            </CardSubtitle>
          </CardBody>
        </Card>
      </React.Fragment>
      <React.Fragment>
        <Card className="request-card-data">
          <CardBody>
            {props.imageHeaderComponent(eventOrange, TRANSLATE.t("REQUESTS.DESCRIPTION_REQUEST"))}
            <CardSubtitle tag="h6" className="mt-2 p-2 field-style">
              {props.description}
            </CardSubtitle>
          </CardBody>
        </Card>
      </React.Fragment>
    </>
  );
};

RequestDemandCard.propTypes = {
  imageHeaderComponent: PropTypes.func.isRequired,
  requestNature: PropTypes.string.isRequired,
  requestCategory: PropTypes.string.isRequired,
  requestObject: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default RequestDemandCard;
