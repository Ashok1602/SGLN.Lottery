import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { Card, CardHeader, CardBody, Badge, Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  unPublishAnnouncement,
} from '../../store/actions';
import ReactTable from '../../components/common/reactTable/TableWithPagination';
import { requestDateTimeFormat, getOrderedItems } from '../../helpers';
import { DEFAULT_DATE_FORMAT } from '../../constants';
import AddAnnouncement from './AddAnnouncementModal';
import ConfirmationModal from '../../components/common/modals/ConfirmationModal';
import Filter from './Filter';
import { confirmPermissions } from '../../helpers';
//constants
import { TRANSLATE } from '../../constants';
const Announcements = () => {
  const [announcementList, setAnnouncementList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [addAnnouncementModel, setAddAnnouncementModel] = useState(false);
  const [updateAnnouncementModel, setupdateAnnouncementModel] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [deleteAnnouncementModel, setDeleteAnnouncementModel] = useState(false);
  const [publishAnnouncementModel, setPublishAnnouncementModel] =
    useState(false);
  const [unPublishAnnouncementModel, setUnPublishAnnouncementModel] =
    useState(false);
  const [recordId, setRecorId] = useState(null);
  const dispatch = useDispatch();

  const nextProps = useSelector((state) => ({
    announcementData: state.Announcement.data,
    data: state.Announcement.updateData,
  }));
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (
      nextProps.announcementData &&
      nextProps.announcementData.data &&
      nextProps.announcementData.data.results
    ) {
      // setAnnouncementList(nextProps.announcementData.data.results);
      setAnnouncementList(
        getOrderedItems(
          nextProps.announcementData.data.results,
          'desc',
          'created'
        ).map((item) => {
          return {
            ...item,
            created: requestDateTimeFormat(item.created, DEFAULT_DATE_FORMAT),
          };
        })
      );
      setTotal(nextProps.announcementData.data.rowCount);
    } else {
      setAnnouncementList([]);
    }
  }, [nextProps.announcementData]);
  function handleCreateAndUpdate(isCreate, data) {
    if (isCreate) {
      setAddAnnouncementModel(true);
    } else {
      setupdateAnnouncementModel(true);
      setInitialValues(data);
    }
  }
  const handleDeleteAndPublish = (event, id) => {
    if (event === 'isDelete') {
      setDeleteAnnouncementModel(true);
      setRecorId(id);
    } else if (event === 'isPublish') {
      setPublishAnnouncementModel(true);
      setRecorId(id);
    } else if (event === 'isUnPublish') {
      setUnPublishAnnouncementModel(true);
      setRecorId(id);
    }
  };
  const mount = useRef(() => {
    fetchData();
  });
  const isSecondRun = useRef(true);
  useEffect(() => {
    if (isSecondRun.current) {
      isSecondRun.current = false;
      return;
    }
    if (nextProps.data) {
      mount.current();
    }
  }, [nextProps.data]);
  const headers = useMemo(
    () => ({
      title: TRANSLATE.t('ANNOUNCEMENT.TITLE'),
      body: TRANSLATE.t('ANNOUNCEMENT.DESCRIPTION'),
      isPublished: TRANSLATE.t('ANNOUNCEMENT.IS_PUBLISHED'),
      documents: TRANSLATE.t('ANNOUNCEMENT.DOCUMENTS'),
      created: TRANSLATE.t('CREATED'),
      action: TRANSLATE.t('ACTIONS'),
    }),
    []
  );
  const columns = useMemo(
    () => [
      {
        Header: headers.title,
        accessor: 'title',
        disableSortBy: true,
        disableFilters: true,
        width: 100,
      },
      {
        Header: headers.body,
        accessor: 'body',
        disableSortBy: true,
        disableFilters: true,
        width: 400,
      },
      {
        Header: headers.isPublished,
        accessor: 'isPublished',
        disableFilters: true,
        width: 100,
        Cell: (row) => {
          if (row.value) {
            return (
              <h5>
                <Badge color='primary' title='click'>
                  {' '}
                  {TRANSLATE.t('ANNOUNCEMENT.PUBLISHED')}
                </Badge>
              </h5>
            );
          }
          return (
            <h5>
              <Badge color='danger' title='click'>
                {TRANSLATE.t('ANNOUNCEMENT.UNPUBLISHED')}
              </Badge>
            </h5>
          );
        },
      },
      {
        Header: headers.created,
        accessor: 'created',
        disableFilters: true,
        width: 100,
      },
      {
        Header: headers.action,
        accessor: 'action',
        disableFilters: true,
        width: 100,
        Cell: (row) => {
          const name = row.row.original.isPublished
            ? 'far fa-eye'
            : 'far fa-eye-slash';
          const eventName = row.row.original.isPublished
            ? 'isUnPublish'
            : 'isPublish';
          return (
            <>
              {confirmPermissions("CanTogglePublishStatus") && <button
                type='button'
                className='btn btn-primary'
                onClick={() => {
                  handleDeleteAndPublish(eventName, row.row.original.id);
                }}
                title={row.row.original.isPublished ? TRANSLATE.t('ANNOUNCEMENT.UNPUBLISH_ANNOUNCEMENT'): TRANSLATE.t('ANNOUNCEMENT.PUBLISH_ANNOUNCEMENT')}
              >
                <i className={name}></i>
              </button> }
              {/* &ensp;
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleCreateAndUpdate(false, row.row.original)}
              >
                <i className="fas fa-edit"></i>
              </button> */}
              &ensp;
              {confirmPermissions("CanDeleteAnnouncement") && <button
                type='button'
                className='btn btn-danger'
                onClick={() => {
                  handleDeleteAndPublish('isDelete', row.row.original.id);
                }}
                title={TRANSLATE.t('ANNOUNCEMENT.DELETE_ANNOUNCEMENT')}
              >
                <i className='far fa-trash-alt'></i>
              </button> }
            </>
          );
        },
      },
    ],
    [headers]
  );
  /*-----------to fetch api data whenever pagination changes---------*/
  const fetchData = useCallback(() => {
    let pageData = {
      page: Number(pageIndex) + 1,
      size: pageSize,
    };
    setPageSize(pageSize);
    let payload = { ...pageData, ...filterData };
    dispatch(getAnnouncement(payload));
  }, [pageSize, pageIndex, filterData, dispatch]);
  /*-----------on filter submit---------*/
  const onFilterSubmit = (formProps) => {
    if (formProps) {
      let formData = { ...formProps };
      if (formData.minCreationDate) {
        formData.minCreationDate = new Date(formData.minCreationDate);
      }
      if (formData.maxCreationDate) {
        formData.maxCreationDate = new Date(formData.maxCreationDate);
      }
      setFilterData(formData);
    } else {
      setPageIndex(0);
      setFilterData({});
    }
  };

  const callApi = (apiType) => {
    switch (apiType) {
      case 'get':
        fetchData();
        break;
      case 'delete':
        dispatch(deleteAnnouncement({ id: recordId }));
        break;
      case 'publish':
        dispatch(publishAnnouncement({ id: recordId }));
        break;
      case 'unPublish':
        dispatch(unPublishAnnouncement({ id: recordId }));
        break;
      default:
        break;
    }
  };
  return (
    <>
      {addAnnouncementModel && (
        <AddAnnouncement
          isOpen={addAnnouncementModel}
          handleModal={setAddAnnouncementModel}
          callApi={callApi}
          title={TRANSLATE.t('ANNOUNCEMENT.CREATE_ANNOUNCEMENT')}
          apiType='get'
          eventType = 'add'
        />
      )}
      {updateAnnouncementModel && (
        <AddAnnouncement
          isOpen={updateAnnouncementModel}
          initialValues={{ ...initialValues }}
          handleModal={setupdateAnnouncementModel}
          callApi={callApi}
          title={TRANSLATE.t('ANNOUNCEMENT.UPDATE_ANNOUNCEMENT')}
          apiType='get'
        />
      )}
      {deleteAnnouncementModel && (
        <ConfirmationModal
          isOpen={deleteAnnouncementModel}
          data={{ isDelete: true, recordId }}
          handleModal={setDeleteAnnouncementModel}
          callApi={callApi}
          apiType='delete'
          title={TRANSLATE.t('ANNOUNCEMENT.DELETE_ANNOUNCEMENT')}
          content={TRANSLATE.t('ANNOUNCEMENT.DELETE_ANNOUNCEMENT_MESSAGE')}
        />
      )}

      {publishAnnouncementModel && (
        <ConfirmationModal
          isOpen={publishAnnouncementModel}
          data={{ isPublish: true, recordId }}
          handleModal={setPublishAnnouncementModel}
          callApi={callApi}
          apiType='publish'
          title={TRANSLATE.t('ANNOUNCEMENT.PUBLISH_ANNOUNCEMENT')}
          content={TRANSLATE.t('ANNOUNCEMENT.PUBLISH_ANNOUNCEMENT_MESSAGE')}
        />
      )}
      {unPublishAnnouncementModel && (
        <ConfirmationModal
          isOpen={unPublishAnnouncementModel}
          data={{ isUnPublish: true, recordId }}
          handleModal={setUnPublishAnnouncementModel}
          callApi={callApi}
          apiType='unPublish'
          title={TRANSLATE.t('ANNOUNCEMENT.UNPUBLISH_ANNOUNCEMENT')}
          content={TRANSLATE.t('ANNOUNCEMENT.UNPUBLISH_ANNOUNCEMENT_MESSAGE')}
        />
      )}
      <div className='mx-3'>
        <Card className='top-margin'>
          <CardHeader>
            <h1>{TRANSLATE.t('ANNOUNCEMENT.ANNOUNCEMENT')}</h1>
           {confirmPermissions("CanCreateAnnouncement") && <Button
              color='primary'
              size='lg'
              onClick={() => handleCreateAndUpdate(true)}
            >
              {TRANSLATE.t('ANNOUNCEMENT.ADD')}
            </Button> }
          </CardHeader>
          <CardBody className='table-col-style'>
            <Filter isVehicleScreen={true} onFilterSubmit={onFilterSubmit} />
            <ReactTable
              columns={columns}
              data={announcementList.length ? announcementList : []}
              pageCount={total ? Math.ceil(total / pageSize) : 0}
              setPageSize={setPageSize}
              fetchData={fetchData}
              currentPage={pageIndex}
              total={total}
              setPageIndex={setPageIndex}
              pageSizeData={pageSize}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Announcements;
