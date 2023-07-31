/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// MetisMenu
import MetisMenu from 'metismenujs';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

//i18n
import { withNamespaces } from 'react-i18next';

const SidebarContent = (props) => {
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    var pathName = props.location.pathname;

    const initMenu = () => {
      new MetisMenu('#side-menu');
      var matchingMenuItem = null;
      var ul = document.getElementById('side-menu');
      var items = ul.getElementsByTagName('a');
      for (var i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname]);

  function activateParentDropdown(item) {
    item.classList.add('active');
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add('mm-active');
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add('mm-show');

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add('mm-active'); // li
          parent3.childNodes[0].classList.add('mm-active'); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add('mm-active');
          }
        }
      }
      return false;
    }
    return false;
  }

  return (
    <React.Fragment>
      <div id='sidebar-menu'>
        <ul className='metismenu list-unstyled' id='side-menu'>
          <li className='menu-title'>{props.t('Menu')}</li>

          {props.routes.map((route, index) => {
            if (!route.hide) {
              if (route.submenu && route.submenu.length) {
                return (
                  <li key={index}>
                    <Link to="/#" className="waves-effect">
                    <i className={`${route.icon}`}></i>
                      <span>{route.name}</span>
                    </Link>
                    <ul className="sub-menu">
                      {route.submenu.map((link, subIndex) => {
                        if (!link.hide) {
                          return (
                            <li key={subIndex}>
                              <Link to={link.path} key={`${index}${subIndex}`}>
                                {/* <route.icon size={18} className="mr-1" /> */}
                                {link.name}
                              </Link>
                            </li>
                          );
                        } else {
                          return null
                        }
                      })}
                    </ul>
                  </li>
                );
              } else if(!route.submenu) {
                return (
                  <li key={index}>
                    <Link to={route.path} key={index}>
                      <i className={`${route.icon}`}></i>
                      <span>{route.name}</span>
                    </Link>
                  </li>
                );
              }
            }
            return null;
          })}
          {/* <li>
            <Link to='/#' className='waves-effect'>
              <i className='bx bx-chalkboard'></i>
              <span>Trainings</span>
            </Link>
            <ul className='sub-menu' aria-expanded='false'>
              <li>
                <Link to='/videoTrainings'>Video Training</Link>
              </li>
              <li>
                <Link to='/distanceTrainings'>Distance Training</Link>
              </li>
            </ul>
          </li> */}
        </ul>
      </div>
    </React.Fragment>
  );
};
SidebarContent.propTypes = {
  routes: PropTypes.array.isRequired,
};
export default withRouter(withNamespaces()(SidebarContent));
