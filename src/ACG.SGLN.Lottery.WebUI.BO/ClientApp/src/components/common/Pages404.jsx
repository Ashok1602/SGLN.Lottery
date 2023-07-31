import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

class Pages404 extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="account-pages my-5 pt-5">
                    <Container>
                        <Row>
                            <Col lg="12">
                                <div className="text-center mb-5">
                                    <h1 className="display-2 font-weight-medium">4<i className="bx bx-buoy bx-spin text-primary display-3"></i>4</h1>
                                    <h4 className="text-uppercase">Sorry, page not found</h4>
                                    <div className="mt-5 text-center">
                                        <Link className="btn btn-primary waves-effect waves-light" to="/dashboard">Back to Dashboard</Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default Pages404;