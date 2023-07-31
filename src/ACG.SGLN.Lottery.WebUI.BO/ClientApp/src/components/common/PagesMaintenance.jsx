import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from "reactstrap";

//Import Images
import maintenance from "../../assets/images/maintenance.png";

class PagesMaintenance extends Component {
    render() {
        return (
            <React.Fragment>
                <section className="my-5 pt-sm-5">
                    <Container>
                        <Row>
                            <Col xs="12" className="text-center">
                                <div className="home-wrapper">
                                    <div className="mb-5">
                                        <h1>SGLN</h1>
                                    </div>

                                    <Row className="justify-content-center">
                                        <Col sm={4}>
                                            <div className="maintenance-img">
                                                <img src={maintenance} alt="" className="img-fluid mx-auto d-block" />
                                            </div>
                                        </Col>
                                    </Row>
                                    <h3 className="mt-5">{this.props.title || "Site"} is Under Maintenance</h3>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </React.Fragment>
        );
    }
}
PagesMaintenance.propTypes = {
    title: PropTypes.string,
  };
export default PagesMaintenance;