import React, { useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useDispatch } from "react-redux";
import {
  getResource
} from "../../store/actions";
//constants
import {TRANSLATE} from "../../constants";
const Dashboard = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getResource());
  }, [dispatch]);
  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col lg={10} className="mx-auto">
            <div className='page-content text-center'>
              <h1>{TRANSLATE.t("DASHBOARD.MESSAGE")}</h1>
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Dashboard;
