import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
  FormGroup,
  Label,
  Media,
  Badge,
} from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRetailerById,
  // getRetailerAgent,
  validateRetailer,
  activateUser,
  inactivateUser,
  getRoleWiseUsers,
  // assignAgentToRetailer,
  assignSaleRepresentative
} from '../../store/actions';
import ConfirmationModal from '../../components/common/modals/ConfirmationModal';
import AssignSalesPersonModel from './AssignSalesPersonModel';
import { TRANSLATE } from '../../constants';
import { openGoogleMaps } from '../../helpers';
import requestDetailImage from '../../assets/images/request-details.png';
import BackButton from '../../components/common/BackButton';
import retailerLogo from '../../assets/images/retailer-logo.png';
import location from '../../assets/images/map.png';
import commercialImg from '../../assets/images/commercial-img.png';
import { confirmPermissions } from '../../helpers';

const RetailerDetails = () => {
  const { pathname } = useLocation();
  const id = pathname.split('/')[2];
  const dispatch = useDispatch();
  const [dropdownOpen, setOpen] = useState(false);
  const [retailerData, setRetailerData] = useState({});
  // const [agentData, setAgentData] = useState({});
  const [roleWiseUser, setRoleWiseUser] = useState([]);
  const [validateRetailerConfirm, setValidateRetailerConfirm] = useState(false);
  const [activateRetailerConfirm, setActivateRetailerConfirm] = useState(false);
  const [inActivateRetailerConfirm, setInActivateRetailerConfirm] =
    useState(false);
  const [assignSalesPersonConfirm, setAssignSalesPersonConfirm] =
    useState(false);
  // global state
  const nextProps = useSelector((state) => ({
    retailer: state.Retailer.retailer,
    agent: state.Retailer.agent,
    updateData: state.Users.updateData || state.Retailer.updateData,
    roleWiseUsers: state.Users.data,
    assignedData: state.Retailer.assignedData,
    // muncipalitiesData: state.Retailer.muncipalitiesData
  }));

  useEffect(() => {
    dispatch(getRetailerById(id));
    // dispatch(getMuncipalities());
    // dispatch(getRetailerAgent(id));
    dispatch(getRoleWiseUsers(['InternalAgents']));
  }, [dispatch, id]);

  const isAssigned = useRef(true);
  useEffect(() => {
    if (isAssigned.current) {
      isAssigned.current = false;
      return;
    }
    if (nextProps.assignedData) {
      dispatch(getRetailerById(id));
      dispatch(getRoleWiseUsers(['InternalAgents']));
    }
  }, [nextProps.assignedData]);

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (nextProps.retailer && nextProps.retailer.data) {
      setRetailerData(nextProps.retailer.data);
    }
  }, [nextProps.retailer]);

  const isSecondRun = useRef(true);
  useEffect(() => {
    if (isSecondRun.current) {
      isSecondRun.current = false;
      return;
    }
    if (nextProps.updateData) {
      dispatch(getRetailerById(id));
      dispatch(getRoleWiseUsers(['InternalAgents']));
    }
  }, [nextProps.updateData, dispatch, id]);

  const isThird = useRef(true);
  useEffect(() => {
    if (isThird.current) {
      isThird.current = false;
      return;
    }
    if (nextProps.roleWiseUsers && nextProps.roleWiseUsers.data) {
      setRoleWiseUser(
        nextProps.roleWiseUsers.data.map((user) => {
          return {
            label: `${user.lastName} ${user.firstName}`,
            value: user.id,
          };
        })
      );
    }
  }, [nextProps.roleWiseUsers]);
  const toggle = () => setOpen(!dropdownOpen);
  const callApi = (apiType, data) => {
    switch (apiType) {
      case 'validate':
        dispatch(validateRetailer({ id: retailerData.userid }));
        break;
      case 'activate':
        dispatch(activateUser({ id: retailerData.userid }));
        break;
      case 'inActivate':
        dispatch(inactivateUser({ id: retailerData.userid }));
        break;
      case 'assignSalesPerson':
        // dispatch(assignAgentToRetailer({ id, agentId: data }));
        dispatch(assignSaleRepresentative({ id, formData: data }))
        break;
      default:
        break;
    }
  };
  const handleConfirmModal = (type) => {
    if (type === 'validate') {
      setValidateRetailerConfirm(!validateRetailerConfirm);
    } else if (type === 'activate') {
      setActivateRetailerConfirm(!activateRetailerConfirm);
    } else if (type === 'inActivate') {
      setInActivateRetailerConfirm(!inActivateRetailerConfirm);
    } else if (type === 'assignSalesPerson') {
      setAssignSalesPersonConfirm(!assignSalesPersonConfirm);
    }
  };
  return (
    <>
      {validateRetailerConfirm && (
        <ConfirmationModal
          isOpen={validateRetailerConfirm}
          handleModal={setValidateRetailerConfirm}
          callApi={callApi}
          apiType='validate'
          title={TRANSLATE.t('RETAILER.VADLIDATE_RETAILER')}
          content={TRANSLATE.t('RETAILER.VADLIDATE_RETAILER_MESSAGE')}
        />
      )}
      {activateRetailerConfirm && (
        <ConfirmationModal
          isOpen={activateRetailerConfirm}
          handleModal={setActivateRetailerConfirm}
          callApi={callApi}
          apiType='activate'
          title={TRANSLATE.t('RETAILER.ACTIVATE_RETAILER')}
          content={TRANSLATE.t('RETAILER.ACTIVATE_RETAILER_MESSAGE')}
        />
      )}
      {inActivateRetailerConfirm && (
        <ConfirmationModal
          isOpen={inActivateRetailerConfirm}
          handleModal={setInActivateRetailerConfirm}
          callApi={callApi}
          apiType='inActivate'
          title={TRANSLATE.t('RETAILER.INACTIVATE_RETAILER')}
          content={TRANSLATE.t('RETAILER.INACTIVATE_RETAILER_MESSAGE')}
        />
      )}
      {assignSalesPersonConfirm && (
        <AssignSalesPersonModel
          isOpen={assignSalesPersonConfirm}
          handleModal={setAssignSalesPersonConfirm}
          callApi={callApi}
          apiType='assignSalesPerson'
          title={TRANSLATE.t('RETAILER.ASSIGN_SALES_PERSON')}
          roleWiseUser={roleWiseUser}
          initialValues={retailerData}
          retailerId={id}
          muncipalitiesList={nextProps.muncipalitiesData || []}
        />
      )}
      <div className='page-content'>
        <Container fluid>
          <Row>
            <Col className='align-middle' xl='9'>
              <Row>
                <Col className='mt-2 ml-2' xl='1'>
                  <BackButton />
                </Col>
                <Col>
                  <div className='d-flex float-left mb-3'>
                    <img
                      className='mr-2'
                      src={requestDetailImage}
                      alt='headerImg'
                      width='75px'
                      height='75px'
                    />
                    <h3 className='title'>
                      {TRANSLATE.t('RETAILER.RETAILER_DETAILS')}
                    </h3>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xl='3'>
              <ButtonDropdown
                isOpen={dropdownOpen}
                toggle={toggle}
                className='float-right'
              >
                <DropdownToggle
                  caret
                  split
                  className='retailer-drop-down-button'
                  color='warning'
                  size='lg'
                >
                  {TRANSLATE.t('CHOOSE_OPTION')}
                  <i className='mdi mdi-chevron-down d-none d-xl-inline-block text-black mr-2'></i>
                </DropdownToggle>
                <DropdownMenu style={{ borderRadius: '14px', width: '180px' }}>
                  {confirmPermissions('CanToggleUserStatus') && (
                    <DropdownItem
                      onClick={() =>
                        handleConfirmModal(
                          retailerData.isDeactivated ? 'activate' : 'inActivate'
                        )
                      }
                    >
                      {retailerData.isDeactivated
                        ? TRANSLATE.t('ACTIVE')
                        : TRANSLATE.t('INACTIVE')}
                    </DropdownItem>
                  )}
                  {!retailerData.isValidated &&
                    confirmPermissions('CanValidateUser') && (
                      <>
                      <DropdownItem divider />
                        <DropdownItem
                          onClick={() => handleConfirmModal('validate')}
                        >
                          {TRANSLATE.t('VALIDATE')}
                        </DropdownItem>
                      </>
                    )}
                  {/* {confirmPermissions('CanAssignAgent') && (
                    <DropdownItem
                      onClick={() => handleConfirmModal('assignSalesPerson')}
                    >
                      {TRANSLATE.t('REQUESTS.ASSIGNED_TO')}
                    </DropdownItem>
                  )} */}
                </DropdownMenu>
              </ButtonDropdown>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className='request-card-data mt-3'>
                <CardBody className='mt-1 ml-3 mr-3'>
                  <Row>
                    <div className='d-flex'>
                      <Media
                        className='mr-3'
                        src={retailerLogo}
                        alt='Header Avatar'
                        width='49px'
                        height='52px'
                      ></Media>
                      <Media heading className='marginTopStyles'>
                        {TRANSLATE.t('RETAILER.PERSONAL')}
                      </Media>
                    </div>
                  </Row>
                  <Row className='mt-3'>
                    <Col>
                      <FormGroup>
                        <Label>{TRANSLATE.t('RETAILER.RETAILER_NAME')}</Label>
                        <div className='p-2 field-style'>
                          {retailerData.lastName} {retailerData.firstName}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>{TRANSLATE.t('USERS.PHONE_NUMBER')}</Label>
                        <div className='p-2 field-style'>
                          {retailerData.phone}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className='mt-3'>
                    <Col xl='10'>
                      <FormGroup>
                        <Label>{TRANSLATE.t('RETAILER.GPS_LOCATION')}</Label>
                        <div className='p-2 field-style'>
                          {retailerData.geographicSector || 'N/A'}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col>
                      <span
                        onClick={() => openGoogleMaps()}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src={location} alt='map' className='mt-3' />
                      </span>
                    </Col>
                  </Row>
                  <Row className='mt-3'>
                    <Col>
                      <FormGroup>
                        <Label> {TRANSLATE.t('RETAILER.LOCAL_ADDRESS')} </Label>
                        <div className='p-2 field-style'>
                          {retailerData.address || 'N/A'}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='request-card-data mt-3'>
                <CardBody className='mt-1 ml-3 mr-3'>
                  <Row>
                    <div className='d-flex'>
                      <Media
                        className='mr-3'
                        src={commercialImg}
                        alt='Commercial Img'
                        width='49px'
                        height='52px'
                      ></Media>
                      <Media heading className='marginTopStyles'>
                        {TRANSLATE.t('RETAILER.COMMERCIAL')}
                      </Media>
                    </div>
                  </Row>
                  <Row className='mt-3'>
                    <Col>
                      <FormGroup>
                        <Label>{TRANSLATE.t('RETAILER.CONTRACT_NUMBER')}</Label>
                        <div className='p-2 field-style'>
                          {retailerData.contractNumber || 'N/A'}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>
                          {TRANSLATE.t('RETAILER.RETAILER_CODE_SGNL')}
                        </Label>
                        <div className='p-2 field-style'>
                          {retailerData.internalRetailerCode || 'N/A'}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className='mt-3'>
                    <Col>
                      <FormGroup>
                        <Label>
                          {TRANSLATE.t('RETAILER.RETAILER_CODE_SISAL')}
                        </Label>
                        <div className='p-2 field-style'>
                          {retailerData.externalRetailerCode || 'N/A'}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label> TC / ICE</Label>
                        <div className='p-2 field-style'>
                          {retailerData.companyIdentifier || 'N/A'}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className='mt-3'>
                    <Col>
                      <FormGroup>
                        <Label> {TRANSLATE.t('STATUS')}</Label>
                        <div className='p-2'>
                          <h5>
                            <Badge className='retailer-badges'>
                              {retailerData.isDeactivated
                                ? TRANSLATE.t('INACTIVE')
                                : TRANSLATE.t('ACTIVE')}
                            </Badge>
                          </h5>
                        </div>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label> {TRANSLATE.t('ACCOUNT')}</Label>
                        <div className='p-2'>
                          <h5>
                            <Badge className='retailer-badges'>
                              {retailerData.isValidated
                                ? TRANSLATE.t('USERS.VALIDATED')
                                : TRANSLATE.t('USERS.DEACTIVATED')}
                            </Badge>
                          </h5>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className='request-card-data mt-1'>
                <CardBody className='mt-1 ml-3 mr-3'>
                  <Row>
                    <div className='d-flex'>
                      <Media
                        className='mr-3'
                        src={retailerLogo}
                        alt='Header Avatar'
                        width='49px'
                        height='52px'
                      ></Media>
                      <Media heading className='marginTopStyles'>
                      Sgln Détails
                      </Media>
                    </div>
                  </Row>
                  <Row className='mt-3'>
                    <Col>
                      <FormGroup>
                        <Label>{TRANSLATE.t('RETAILER.SGLN_NAME')}</Label>
                        <div className='p-2 field-style'>
                          {retailerData.sglnCommercialName || 'N/A'}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>
                          {TRANSLATE.t('RETAILER.SGLN_EMAIL')}
                        </Label>
                        <div className='p-2 field-style'>
                          {retailerData.sglnCommercialMail || 'N/A'}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className='mt-3'>
                    <Col>
                      <FormGroup>
                        <Label>{TRANSLATE.t('RETAILER.SGLN_PHONE')}</Label>
                        <div className='p-2 field-style'>
                          {retailerData.sglnCommercialPhone || 'N/A'}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='request-card-data mt-1'>
                <CardBody className='mt-1 ml-3 mr-3'>
                <Row>
                    <div className='d-flex'>
                      <Media
                        className='mr-3'
                        src={retailerLogo}
                        alt='Header Avatar'
                        width='49px'
                        height='52px'
                      ></Media>
                      <Media heading className='marginTopStyles'>
                        Sisal Détails
                      </Media>
                    </div>
                  </Row>
                  <Row className='mt-3'>
                    <Col>
                      <FormGroup>
                        <Label>{TRANSLATE.t('RETAILER.SISAL_NAME')}</Label>
                        <div className='p-2 field-style'>
                          {retailerData.sisalCommercialName || 'N/A'}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>
                          {TRANSLATE.t('RETAILER.SISAL_EMAIL')}
                        </Label>
                        <div className='p-2 field-style'>
                          {retailerData.sisalCommercialMail || 'N/A'}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className='mt-3'>
                    <Col>
                      <FormGroup>
                        <Label>{TRANSLATE.t('RETAILER.SISAL_PHONE')}</Label>
                        <div className='p-2 field-style'>
                          {retailerData.sisalCommercialPhone || 'N/A'}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default RetailerDetails;
