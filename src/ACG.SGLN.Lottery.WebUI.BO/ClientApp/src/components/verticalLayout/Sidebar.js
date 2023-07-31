/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Simple bar
import SimpleBar from "simplebar-react";

//i18n
import { withNamespaces } from 'react-i18next';
import SidebarContent from "./SidebarContent";

import { userRoutes } from "../../routes/allRoutes"

const Sidebar = (props) => {
          return (
            <React.Fragment>
                <div className="vertical-menu">
                    <div data-simplebar className="h-100">
                        {props.type !== "condensed" ? (
                            <SimpleBar style={{ maxHeight: "100%" }}>
                                <SidebarContent routes={userRoutes} />
                            </SimpleBar>
                        ) : <SidebarContent routes={userRoutes} />}
                    </div>

                </div>
            </React.Fragment>
          );
        }

const mapStatetoProps = state => {
    return {
        layout: state.Layout
    };
};
Sidebar.propTypes = {
    type: PropTypes.string.isRequired
};
export default connect(mapStatetoProps, {})(withRouter(withNamespaces()(Sidebar)));
