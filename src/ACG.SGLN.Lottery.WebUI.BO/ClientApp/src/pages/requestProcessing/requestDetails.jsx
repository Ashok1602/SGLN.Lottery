import React, { useState, useRef, useEffect } from 'react';
import { Button, Row, Col, Container, Media } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRequestById,
  startRequest,
  closeRequest,
  createRequestComment,
  getRequestCommentById,
  assignRequest,
} from '../../store/actions';
import RequestRetailerCard from './RequestRetailerCard';
import RequestCommentCard from './RequestCommentCard';
import AttachmentData from './AttachmentData';
import RequestDemandCard from './RequestDemandCard';
import RequestHistoryCard from './RequestHistoryCard';
import requestDetailImage from '../../assets/images/request-details.png';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from '../../constants';
import ConfirmationModal from '../../components/common/modals/ConfirmationModal';
import ValidationModal from './ValidationModal';
import CreateCommentModal from '../../components/common/modals/CreateCommentModal';
import AssignRequestModel from './AssignRequestModel';
import RequestClosedCard from './RequestClosedCard';
import { TRANSLATE } from '../../constants';
import BackButton from '../../components/common/BackButton';
import { confirmPermissions, isAdmin } from '../../helpers';

const RequestDetails = () => {
  const { pathname } = useLocation();
  const id = pathname.split('/')[2];
  const dispatch = useDispatch();
  const [requestDetails, setRrequestDetails] = useState({});
  const [requestComment, setRequestcomment] = useState([]);
  const [isOpenStartConfirm, updateIsOpenStartConfirm] = useState(false);
  const [isOpenCloseConfirm, updateIsOpenCloseConfirm] = useState(false);
  const [isOpenCommentModal, updateIsOpenCommentModal] = useState(false);
  const [isAssignRequestModal, updateIsAssignRequestModal] = useState(false);
  const userData = JSON.parse(localStorage.getItem('loginInfo') || {}).userData;
  const isAdminBool = isAdmin();
  const roleName = userData
    ? userData.roleName.substring(0, userData.roleName.length - 1)
    : '';

  const nextProps = useSelector((state) => ({
    requestDetails: state.Requests.data,
    startData: state.Requests.startData,
    closeData: state.Requests.closeData,
    assignData: state.Requests.assignData,
    createCommentSuccess: state.RequestComment.createCommentSuccess,
    requestComment: state.RequestComment.data,
  }));

  useEffect(() => {
    dispatch(getRequestById(id));
    dispatch(getRequestCommentById(id));
  }, [dispatch, id]);
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (nextProps.requestDetails && nextProps.requestDetails.data) {
      setRrequestDetails(nextProps.requestDetails.data);
    }
  }, [nextProps.requestDetails]);

  const isSecond = useRef(true);
  useEffect(() => {
    if (isSecond.current) {
      isSecond.current = false;
      return;
    }
    if (nextProps.requestComment && nextProps.requestComment.data) {
      setRequestcomment(nextProps.requestComment.data);
    }
  }, [nextProps.requestComment]);

  const isStart = useRef(true);
  useEffect(() => {
    if (isStart.current) {
      isStart.current = false;
      return;
    }
    if (nextProps.startData) {
      dispatch(getRequestById(id));
    }
  }, [nextProps.startData, dispatch, id]);

  const isCommentSuccess = useRef(true);
  useEffect(() => {
    if (isCommentSuccess.current) {
      isCommentSuccess.current = false;
      return;
    }
    if (nextProps.createCommentSuccess) {
      dispatch(getRequestById(id));
      dispatch(getRequestCommentById(id));
    }
  }, [nextProps.createCommentSuccess, dispatch, id]);

  const isClose = useRef(true);
  useEffect(() => {
    if (isClose.current) {
      isClose.current = false;
      return;
    }
    if (nextProps.closeData) {
      dispatch(getRequestById(id));
    }
  }, [nextProps.closeData, dispatch, id]);

  const assignReq = useRef(true);
  useEffect(() => {
    if (assignReq.current) {
      assignReq.current = false;
      return;
    }
    if (nextProps.assignData) {
      dispatch(getRequestById(id));
    }
  }, [nextProps.assignData, dispatch, id]);

  const imageHeaderComponent = (image, title) => {
    return (
      <div className='d-flex'>
        <Media
          className='mr-3'
          src={image}
          alt='Header Avatar'
          height='50px'
        ></Media>
        <Media heading className='marginTopStyles'>
          {title}
        </Media>
      </div>
    );
  };
  const callApi = (apiType, data) => {
    switch (apiType) {
      case 'start':
        dispatch(startRequest({ id: id }));
        break;
      case 'close':
        dispatch(
          closeRequest({
            id: id,
            data: data,
          })
        );
        break;
      case 'addComment':
        dispatch(
          createRequestComment({
            data: {
              requestId: id,
              body: data.body,
            },
          })
        );
        break;
      case 'Assign':
        dispatch(
          assignRequest({
            id: id,
            isExternal: data.isExternal,
            processingDirection: data.processingDirection
          })
        );
        break;
      default:
        break;
    }
  };
  const handleConfirmModal = (type) => {
    if (type === 'start') {
      updateIsOpenStartConfirm(!isOpenStartConfirm);
    } else if (type === 'close') {
      updateIsOpenCloseConfirm(!isOpenCloseConfirm);
    } else if (type === 'addComment') {
      updateIsOpenCommentModal(!isOpenCommentModal);
    } else if (type === 'Assign') {
      updateIsAssignRequestModal(!isAssignRequestModal);
    }
  };

  return (
    <React.Fragment>
      {isOpenStartConfirm && (
        <ConfirmationModal
          isOpen={isOpenStartConfirm}
          handleModal={updateIsOpenStartConfirm}
          callApi={callApi}
          apiType='start'
          title={TRANSLATE.t('REQUESTS.START_REQUEST_PROCESSING')}
          content={TRANSLATE.t('REQUESTS.START_REQUEST_PROCESSING_MESSAGE')}
        />
      )}
      {isOpenCloseConfirm && (
        <ValidationModal
          isOpen={isOpenCloseConfirm}
          handleModal={updateIsOpenCloseConfirm}
          callApi={callApi}
          apiType='close'
          title={TRANSLATE.t('REQUESTS.CLOSE_REQUEST')}
          content={TRANSLATE.t('REQUESTS.SELECT_MAX_DATE')}
        />
      )}
      {isOpenCommentModal && (
        <CreateCommentModal
          isOpen={isOpenCommentModal}
          handleModal={updateIsOpenCommentModal}
          callApi={callApi}
          apiType='addComment'
          title={TRANSLATE.t('REQUESTS.ADD_COMMENT')}
        />
      )}
      {isAssignRequestModal && (
        <AssignRequestModel
          isOpen={isAssignRequestModal}
          handleModal={updateIsAssignRequestModal}
          callApi={callApi}
          apiType='Assign'
          title={TRANSLATE.t('REQUESTS.ASSIGNED_TO')}
        />
      )}
      <div className='page-content'>
        <Container fluid>
          <Row>
            <Col className='align-middle' xl='9'>
              <div className='d-flex float-left mb-3'>
                <div className='mr-3 mt-4'>
                  <BackButton />
                </div>
                <img
                  className='mr-2'
                  src={requestDetailImage}
                  alt='headerImg'
                  width='75px'
                  height='75px'
                />
                <h3 className='title'>
                  {' '}
                  {TRANSLATE.t('REQUESTS.REQUEST_NUMBER')} :{' '}
                  {requestDetails.reference ? requestDetails.reference : id}
                </h3>
              </div>
            </Col>
            {(roleName !== "PlatformManager" && !isAdminBool)  ?
            // requestDetails.requestNature === userData.requestNatureInCharge &&
            <Col xl={3}>
              {requestDetails.requestAssignedTo === 'None' &&
              <Button
                className='update-button'
                color='warning'
                size='lg'
                onClick={() => handleConfirmModal('Assign')}
              >
                {TRANSLATE.t('REQUESTS.ASSIGNED_TO')}
              </Button>}
              {requestDetails.lastStatus === 'Submitted' 
              && confirmPermissions('CanStartRequest') 
              && roleName === requestDetails.requestAssignedTo 
              && <Button
                className='update-button'
                color='warning'
                size='lg'
                onClick={() => handleConfirmModal('start')}
              >
                {'Démarrer'}
              </Button> }
              {(requestDetails.lastStatus === 'Contested' || requestDetails.lastStatus === 'InProgress')
              && confirmPermissions('CanCloseRequest') 
              && roleName === requestDetails.requestAssignedTo 
              && <Button
                className='update-button'
                color='warning'
                size='lg'
                onClick={() => handleConfirmModal('close')}
              >
                {'Clôturer demande'}
              </Button>}
            </Col>
            :
            <Col xl={3}>
              {roleName === "PlatformManager" && requestDetails.requestAssignedTo === 'None' &&
              <Button
                className='update-button'
                color='warning'
                size='lg'
                onClick={() => handleConfirmModal('Assign')}
              >
                {TRANSLATE.t('REQUESTS.ASSIGNED_TO')}
              </Button>
              }
            </Col>
            }

          </Row>
          <Row>
            <Col xl='3'>
              <RequestRetailerCard retailer={requestDetails.retailer || {}} />
            </Col>
            <Col xl='3'>
              <RequestDemandCard
                imageHeaderComponent={imageHeaderComponent}
                requestNature={requestDetails.requestNature || ''}
                requestCategory={requestDetails.requestCategory || ''}
                requestObject={requestDetails.requestObject || ''}
                description={requestDetails.description || ''}
              />
            </Col>
            <Col xl='3'>
              <RequestCommentCard
                imageHeaderComponent={imageHeaderComponent}
                comments={requestDetails.comments || requestComment}
                handleConfirmModal={handleConfirmModal}
                requestDetails={requestDetails}
              />
            </Col>
            <Col xl='3'>
              <RequestHistoryCard
                imageHeaderComponent={imageHeaderComponent}
                status={requestDetails.statuses || []}
                createDate={moment(requestDetails.created).format(
                  DEFAULT_DATE_FORMAT
                )}
              />
            </Col>
          </Row>
          {requestDetails.lastStatus === 'Closed' && (
            <RequestClosedCard
              imageHeaderComponent={imageHeaderComponent}
              closingDescriptionMessage={
                requestDetails.closingDescriptionMessage
              }
              closingRetailerMessage={requestDetails.closingRetailerMessage}
            />
          )}
          <Row>
            <Col>
              <AttachmentData
                imageHeaderComponent={imageHeaderComponent}
                documentsData={requestDetails.documents || []}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default RequestDetails;
