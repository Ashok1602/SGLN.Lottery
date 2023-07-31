import React from "react";
import PropTypes from "prop-types";
import { CardBody, Card, CardHeader, Collapse } from "reactstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const CommonCollapse = (props) => {
  return (
    <div>
      <Card className="mb-2 ">
        <CardHeader
          className="p-3 cursor-pointer"
          id="headingTwo"
          onClick={() => props.toggle()}
        >
          <h5 className="f-700 d-flex">
            {props.title}
            <span className="justify-content-end ml-auto">
              {props.isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </h5>
        </CardHeader>
        <Collapse isOpen={props.isOpen}>
          <CardBody>{props.children}</CardBody>
        </Collapse>
      </Card>
    </div>
  );
};
CommonCollapse.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
};
export default CommonCollapse;
