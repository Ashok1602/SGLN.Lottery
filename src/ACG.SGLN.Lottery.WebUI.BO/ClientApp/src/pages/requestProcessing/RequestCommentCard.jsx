import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, ListGroupItem } from "reactstrap";
import requestChat from "../../assets/images/request-chat-logo.png";
import plusButtonImg from "../../assets/images/plus-botton-img.png";
import PropTypes from "prop-types";
import moment from "moment";
import { DEFAULT_DATE_FORMAT } from "../../constants";

const RequestCommentCard = (props) => {
  const [commentsData, updateCommentsData] = useState([]);
  const userData = JSON.parse(localStorage.getItem('loginInfo') || {}).userData;
  useEffect(() => {
    updateCommentsData(props.comments);
  }, [props.comments]);

  const roleName = userData ? userData.roleName.substring(0, userData.roleName.length - 1) : "";
  const commentData = commentsData.map((comment, key) => {
    return (
      <ListGroupItem key={key}>
        <figure className="quote">
          <div style = {{front: "Poppins", fontWeight:"500", frontSize: "16px"}}>{comment.body}</div>
          <div className="text-right">
            <span>{comment.createdBy.split(":")[0]}</span>
            <br />
            <span> {moment(comment.created).format(DEFAULT_DATE_FORMAT)}</span>
          </div>
        </figure>
      </ListGroupItem>
    );
  });
  return (
    <React.Fragment>
      <Card className="request-card-data">
        <CardBody>
          <CardTitle className="mb-2">
            {props.imageHeaderComponent(requestChat, "Commentaires")}
          </CardTitle>
          <div
            className="form-group vertical-scroll"
            style={{ maxHeight: "500px" }}
          >
            {commentData}
          </div>
        </CardBody>
        {!["Submitted", "Closed", "Cancelled"].includes(props.requestDetails.lastStatus) && roleName === props.requestDetails.requestAssignedTo ? (
          <div className="comment-button">
            <button onClick={() => props.handleConfirmModal("addComment")}>
              <img src={plusButtonImg} alt="plusIcon" />
            </button>
          </div>
        ) : (
          ""
        )}
      </Card>
    </React.Fragment>
  );
};
RequestCommentCard.propTypes = {
  imageHeaderComponent: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  handleConfirmModal: PropTypes.func.isRequired,
  requestDetails: PropTypes.object,
};

export default RequestCommentCard;
