import React, { useState, useEffect, useRef } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';
import PropTypes from 'prop-types';
//i18n
import { withNamespaces } from 'react-i18next';
// Redux
import { connect } from 'react-redux';
import { useSelector, useDispatch } from "react-redux";
import { withRouter, Link } from 'react-router-dom';
import { logoutUser } from '../../../store/actions';

// users
import defaultAvatar from '../../../assets/images/default-avatar.png';

const ProfileMenu = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const dispatch = useDispatch();

  /*------handling api data---------*/
  const nextProps = useSelector((state) => ({
    logoutSuccess:
      state.Login.logoutSuccess
  }));

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (nextProps.logoutSuccess) {
      localStorage.removeItem('loginInfo');
    }
  }, [nextProps.logoutSuccess]);

  const { userData } = JSON.parse(localStorage.getItem("loginInfo")); 

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className='d-inline-block bg-dark'
      >
        <DropdownToggle
          className='btn header-item waves-effect bg-dark'
          id='page-header-user-dropdown'
          tag='button'
        >
          <img
            className='rounded-circle header-profile-user'
            src={defaultAvatar}
            alt='Header Avatar'
          />
          <i className='mdi mdi-chevron-down d-none d-xl-inline-block text-white pl-2'></i>
        </DropdownToggle>
        <DropdownMenu right>
        <i className='dropdown-item'>
        <span>{`${userData.firstName} ${userData.lastName}`}</span>
        </i>
        <div className='dropdown-divider'></div>
          <Link to='/change-password' className='dropdown-item'>
            <i className='bx bx-user font-size-16 align-middle mr-1'></i>
            <span>{props.t('CHANGE_PASSWORD.CHANGE_PASSWORD')}</span>
          </Link>
          <div className='dropdown-divider'></div>
          <Link
          to='/#'
            className='dropdown-item'
            onClick={() => dispatch(logoutUser())}
          >
            <i className='bx bx-power-off font-size-16 align-middle mr-1 text-danger'></i>
            <span>{props.t('LOGOUT')}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  t: PropTypes.func,
};

export default withRouter(
  connect()(withNamespaces()(ProfileMenu))
);
