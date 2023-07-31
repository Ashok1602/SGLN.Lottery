import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { Card, CardHeader, CardBody, Button, Badge } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getStrippedCategory,
  getResource,
  getApplicationSettings,
  deleteApplicationSettings,
  activateApplicationSettings,
  inActivateApplicationSettings,
  // updateApplicationSettings
} from '../../store/actions';
import ReactTable from '../../components/common/reactTable/TableWithPagination';
import { requestDateTimeFormat, getOrderedItems } from '../../helpers';
import { DEFAULT_DATE_FORMAT } from '../../constants';
import AddApplicationSettingModal from './AddSettingModal';
import ConfirmationModal from '../../components/common/modals/ConfirmationModal';
import Filter from './Filter';
//constants
import { TRANSLATE } from '../../constants';
//helpers
import { getRequestNatureTypes } from '../../helpers';
import { confirmPermissions } from '../../helpers';

const ApplicationSettings = () => {
  const [announcementList, setAnnouncementList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [addSettingModel, setSettingModelModel] = useState(false);
  const [updateSettingModel, setupdateSettingModel] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [deleteSettingModel, setDeleteSettingModel] = useState(false);
  const [recordId, setRecorId] = useState(null);
  const [activateSettingModel, setActivateSettingModel] = useState(false);
  const [inActivateSettingModel, setInActivateSettingModel] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStrippedCategory());
    dispatch(getResource());
  }, [dispatch])

  const nextProps = useSelector((state) => ({
    appSettingsData: state.ApplicationSettings.data,
    data: state.ApplicationSettings.updateData,
    categoriesList: state.RequestCategory.strippedData
  }));

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (nextProps.appSettingsData && nextProps.appSettingsData.data) {

      setAnnouncementList(
        getOrderedItems(
          nextProps.appSettingsData.data.results,
          'desc',
          'created'
        ).map((item) => {
          return {
            ...item,
            created: requestDateTimeFormat(item.created, DEFAULT_DATE_FORMAT),
            requestCategory: item.requestCategory?.id,
            requestCategoryTitle: item.requestCategory?.title,
          };
        })
      );
      setTotal(nextProps.appSettingsData.data.rowCount);
    } else {
      setAnnouncementList([]);
    }
  }, [nextProps.appSettingsData]);
  function handleCreateAndUpdate(isCreate, data) {
    if (isCreate) {
      setSettingModelModel(true);
    } else {
      setupdateSettingModel(true);
      data.nature = 'Administration';
      data.isExternal = data.isExternal ? 'true' : 'false';
      setInitialValues(data);
    }
  }
  const handleDeleteAndPublish = (event, id) => {
    if (event === 'isDelete') {
      setDeleteSettingModel(true);
      setRecorId(id);
    } else if (event === 'activate') {
      setActivateSettingModel(true);
      setRecorId(id);
    } else if (event === 'inActivate') {
      setInActivateSettingModel(true);
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
      isDeactivated: TRANSLATE.t('ANNOUNCEMENT.IS_PUBLISHED'),
      requestCategoryTitle: TRANSLATE.t('REQUESTS.REQUEST_CATEGORY'),
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
      },
      {
        Header: headers.requestCategoryTitle,
        accessor: 'requestCategoryTitle',
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.created,
        accessor: 'created',
        disableFilters: true,
      },
      {
        Header: headers.isDeactivated,
        accessor: 'isDeactivated',
        disableFilters: true,
        width: 100,
        Cell: (row) => {
          if (row.value) {
            return (
              <h5>
                <Badge color='primary' title='click'>
                  {TRANSLATE.t('ANNOUNCEMENT.UNPUBLISHED')}
                </Badge>
              </h5>
            );
          }
          return (
            <h5>
              <Badge color='danger' title='click'>
                {TRANSLATE.t('ANNOUNCEMENT.PUBLISHED')}
              </Badge>
            </h5>
          );
        },
      },
      {
        Header: headers.action,
        accessor: 'action',
        disableFilters: true,
        Cell: (row) => {
          const name = !row.row.original.isDeactivated
            ? 'far fa-eye'
            : 'far fa-eye-slash';
          const eventName = !row.row.original.isDeactivated
            ? 'inActivate'
            : 'activate';
          if (row.row.original.isExternal !== null) {
            return (
              <>
                {confirmPermissions('CanToggleRequestObjectStatus') && (
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => {
                      handleDeleteAndPublish(eventName, row.row.original.id);
                    }}
                    title={
                      row.row.original.isDeactivated
                        ? TRANSLATE.t('APP_SETTINGS.ACTIVATE_SETTING')
                        : TRANSLATE.t('APP_SETTINGS.INACTIVATE_SETTING')
                    }
                  >
                    <i className={name}></i>
                  </button>
                )}
                &ensp;
                {confirmPermissions('CanUpdateRequestObject') && (
                  <button
                    type='button'
                    className='btn btn-success'
                    onClick={() =>
                      handleCreateAndUpdate(false, row.row.original)
                    }
                    title={TRANSLATE.t('APP_SETTINGS.UPDATE_SETTING')}
                  >
                    <i className='fas fa-edit'></i>
                  </button>
                )}
                &ensp;
                {confirmPermissions('CanDeleteRequestObject') && (
                  <button
                    type='button'
                    className='btn btn-danger'
                    onClick={() => {
                      handleDeleteAndPublish('isDelete', row.row.original.id);
                    }}
                    title={TRANSLATE.t('APP_SETTINGS.DELETE_SETTING')}
                  >
                    <i className='far fa-trash-alt'></i>
                  </button>
                )}
              </>
            );
          } else {
            return <></>;
          }
        },
      },
    ],
    [headers]
  );
  // /*-----------to fetch api data whenever pagination changes---------*/
  const fetchData = useCallback(() => {
    let pageData = {
      page: Number(pageIndex) + 1,
      size: pageSize,
    };
    setPageSize(pageSize);
    let payload = { ...pageData, ...filterData };
    dispatch(getApplicationSettings(payload));
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
        dispatch(deleteApplicationSettings({ id: recordId }));
        break;
      case 'activate':
        dispatch(activateApplicationSettings({ id: recordId }));
        break;
      case 'inActive':
        dispatch(inActivateApplicationSettings({ id: recordId }));
        break;
      default:
        break;
    }
  };
  
  return (
    <>
      {addSettingModel && (
        <AddApplicationSettingModal
          isOpen={addSettingModel}
          handleModal={setSettingModelModel}
          callApi={callApi}
          title={TRANSLATE.t('APP_SETTINGS.CREATE_SETTING')}
          apiType='get'
          natureTypes={getRequestNatureTypes()}
          requestCategoryTypesData={nextProps.categoriesList || []}
        />
      )}
      {updateSettingModel && (
        <AddApplicationSettingModal
          isOpen={updateSettingModel}
          initialValues={{ ...initialValues }}
          handleModal={setupdateSettingModel}
          callApi={callApi}
          title={TRANSLATE.t('APP_SETTINGS.UPDATE_SETTING')}
          apiType='get'
          natureTypes={getRequestNatureTypes()}
          requestCategoryTypesData={nextProps.categoriesList || []}
        />
      )}
      {deleteSettingModel && (
        <ConfirmationModal
          isOpen={deleteSettingModel}
          data={{ isDelete: true, recordId }}
          handleModal={setDeleteSettingModel}
          callApi={callApi}
          apiType='delete'
          title={TRANSLATE.t('APP_SETTINGS.DELETE_SETTING')}
          content={TRANSLATE.t('APP_SETTINGS.DELETE_SETTING_MESSAGE')}
        />
      )}
      {activateSettingModel && (
        <ConfirmationModal
          isOpen={activateSettingModel}
          handleModal={setActivateSettingModel}
          callApi={callApi}
          apiType='activate'
          title={TRANSLATE.t('APP_SETTINGS.ACTIVATE_SETTING')}
          content={TRANSLATE.t('APP_SETTINGS.ACTIVATE_SETTING_MESSAGE')}
        />
      )}
      {inActivateSettingModel && (
        <ConfirmationModal
          isOpen={inActivateSettingModel}
          data={{ isUnPublish: true, recordId }}
          handleModal={setInActivateSettingModel}
          callApi={callApi}
          apiType='inActive'
          title={TRANSLATE.t('APP_SETTINGS.INACTIVATE_SETTING')}
          content={TRANSLATE.t('APP_SETTINGS.INACTIVATE_SETTING_MESSAGE')}
        />
      )}
      <div className='mx-3'>
        <Card className='top-margin'>
          <CardHeader>
            <h1>{TRANSLATE.t('APP_SETTINGS.APP_SETTINGS')}</h1>
            {confirmPermissions('CanCreateRequestObject') && (
              <Button
                color='primary'
                size='lg'
                onClick={() => handleCreateAndUpdate(true)}
              >
                {TRANSLATE.t('APP_SETTINGS.ADD')}
              </Button>
            )}
          </CardHeader>
          <CardBody>
            <Filter
              isVehicleScreen={true}
              onFilterSubmit={onFilterSubmit}
              natureTypes={getRequestNatureTypes()}
            />
            <ReactTable
              columns={columns}
              data={announcementList.length ? announcementList : []}
              pageCount={total ? Math.ceil(total / pageSize) : 0}
              setPageSize={setPageSize}
              fetchData={fetchData}
              currentPage={pageIndex}
              total={total || 0}
              setPageIndex={setPageIndex}
              pageSizeData={pageSize}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default ApplicationSettings;
