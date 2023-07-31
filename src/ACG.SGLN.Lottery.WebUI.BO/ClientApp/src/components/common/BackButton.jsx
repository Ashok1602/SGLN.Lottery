import React from "react";
import { useHistory } from "react-router-dom";
import leftArrow from "../../assets/images/left-arrow.png";

function BackButton() {
  const history = useHistory();
  return (
    <div className="back-button mt-1">
      <a
        href={() => history.goBack()}
        onClick={() => {
          history.goBack();
        }}
      >
        <img src={leftArrow} alt="left-arrow" />
      </a>
    </div>
  );
}
export default BackButton;
