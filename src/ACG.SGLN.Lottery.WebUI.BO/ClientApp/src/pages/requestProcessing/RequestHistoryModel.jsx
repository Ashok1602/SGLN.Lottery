import React from "react";
import PropTypes from "prop-types";
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from '../../constants';

function RequestHistoryModel(props) {
  const RequestStatusTypesData =
    localStorage.getItem('resourceInfo') &&
    JSON.parse(localStorage.getItem('resourceInfo')).RequestStatusType;
  return (
    <React.Fragment>
      <li className="event-list">
        <div className="event-timeline-dot">
          <i
            className={
              props.status.isLatest
                ? "bx bx-right-arrow-circle bx-fade-right"
                : "bx bx-right-arrow-circle"
            }
          ></i>
        </div>
        <div className="media">
          <div className="mr-3">
            <i
              className={"bx " + props.status.iconClass + " h2 text-primary"}
            ></i>
          </div>
          <div className="media-body">
            <div>
              <h5>{RequestStatusTypesData[props.status.statusType]}</h5>
              <p className="text-muted">{moment(props.status.created).format(DEFAULT_DATE_FORMAT)}</p>
            </div>
          </div>
        </div>
      </li>
    </React.Fragment>
  );
}

RequestHistoryModel.propTypes = {
  status: PropTypes.object,
};

export default RequestHistoryModel;
