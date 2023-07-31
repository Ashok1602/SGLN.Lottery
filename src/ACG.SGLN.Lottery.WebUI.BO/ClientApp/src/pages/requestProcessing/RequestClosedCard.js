import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, CardSubtitle, Row, Col } from "reactstrap";
import eventSky from "../../assets/images/event-sky.png";
import { TRANSLATE } from "../../constants";
const RequestClosedCard = (props) => {
  return (
    <Row>
      <Col xl="6">
        <Card className="request-card-data">
          <CardBody>
            {props.imageHeaderComponent(
              eventSky,
              TRANSLATE.t("REQUESTS.CLOSING_DESCRIPTION_MESSAGE")
            )}
            <CardSubtitle tag="h3" className="card-sub-title">
              {props.closingDescriptionMessage}
            </CardSubtitle>
          </CardBody>
        </Card>
      </Col>
      <Col xl="6">
        <Card className="request-card-data">
          <CardBody>
            {props.imageHeaderComponent(
              eventSky,
              TRANSLATE.t("REQUESTS.CLOSING_RETAILER_MESSAGE")
            )}
            <CardSubtitle tag="h3" className="card-sub-title">
              {props.closingRetailerMessage}
            </CardSubtitle>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

RequestClosedCard.propTypes = {
  imageHeaderComponent: PropTypes.func.isRequired,
  closingDescriptionMessage: PropTypes.string,
  closingRetailerMessage: PropTypes.string,
};

export default RequestClosedCard;
