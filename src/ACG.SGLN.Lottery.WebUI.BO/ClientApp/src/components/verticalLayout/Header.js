import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ProfileMenu from "../commonForBoth/topbarDropdown/ProfileMenu";
import logo from "./../../assets/images/logo-loterie.png";

//i18n
import { withNamespaces } from "react-i18next";

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions";

const Header = () => {
  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex"></div>
          <img className="mr-3" src={logo} alt="Main Logo" />
          <div className="d-flex bg-dark">
            {/* <NotificationDropdown /> */}
            <ProfileMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};
const mapStatetoProps = (state) => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout;
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

Header.propTypes = {
  toggleLeftmenu: PropTypes.func.isRequired,
  changeSidebarType: PropTypes.func.isRequired,
  leftSideBarType: PropTypes.string.isRequired,
  leftMenu: PropTypes.bool.isRequired,
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withNamespaces()(Header));
