import React from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import RequestHistoryModel from "./RequestHistoryModel";
import infoLogo from "../../assets/images/info-logo.png";
import requestHistory from "../../assets/images/history-logo.png";
import PropTypes from "prop-types";
import { TRANSLATE } from "../../constants";

const RequestHistoryCard = (props) => {
  return (
    <>
      <Card className="request-card-data">
        <CardBody>
          <CardTitle>
            {props.imageHeaderComponent(infoLogo, "Info général")}
          </CardTitle>
          <CardSubtitle tag="h3" className="info-card-sub-title">
            Date création demande
          </CardSubtitle>
          <CardSubtitle tag="h3" className="info-card-sub-title mt-1">
            Le: {props.createDate}
          </CardSubtitle>
        </CardBody>
      </Card>
      <Card className="request-card-data">
        <CardBody>
          {props.imageHeaderComponent(requestHistory, TRANSLATE.t("REQUESTS.HISTORY_REQUEST"))}
        </CardBody>
        <div className="form-group vertical-scroll" style={{ maxHeight: "300px" }}>
          <ul className="verti-timeline list-unstyled">
            {props.status.map((status, key) => {
              status.isLatest = props.status.length - 1 === key ? true : false;
              status.iconClass =
                status.statusType === "Closed"
                  ? "bx-check-circle"
                  : "bx-comment-check";
              return (
                <RequestHistoryModel status={status} key={"_status_" + key} />
              );
            })}
          </ul>
        </div>
      </Card>
    </>
  );
};
RequestHistoryCard.propTypes = {
  status: PropTypes.array.isRequired,
  imageHeaderComponent: PropTypes.func.isRequired,
  createDate: PropTypes.string.isRequired,
};

export default RequestHistoryCard;
