import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCategories,
  deleteCategory,
  activateCategory,
  inactivateCategory,
  getResource
} from '../../store/actions';
import { getOrderedItems } from '../../helpers';
import { Card, CardHeader, CardBody, Button, Badge } from 'reactstrap';
import ReactTable from '../../components/common/reactTable/TableWithPagination';
import ConfirmationModal from '../../components/common/modals/ConfirmationModal';
import AddCategoryModel from './AddCategoryModel';
import Filter from './Filter';
import { TRANSLATE } from '../../constants';
import { confirmPermissions, getRequestNatureTypes } from '../../helpers';

const RequestCategoryList = () => {
  const dispatch = useDispatch();
  const [userList, setUserList] = useState([]);
  const [deleteUserModel, setDeleteUser] = useState(false);
  const [recordId, setRecorId] = useState(null);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [addUserModel, setAddUserModel] = useState(false);
  const [updateUserModel, setUpdateUserModel] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [publishUserModel, setPublishUserModel] = useState(false);
  const [unPublishUserModel, setUnPublishUserModel] = useState(false);

  useEffect(() => {
    dispatch(getResource());
  }, [dispatch])

  const nextProps = useSelector((state) => ({
    categoriesData: state.RequestCategory.data,
    updateData: state.RequestCategory.updateData,
  }));

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (
      nextProps.categoriesData &&
      nextProps.categoriesData.data &&
      nextProps.categoriesData.data.results
    ) {
      const requestNatureData = JSON.parse(
        localStorage.getItem("resourceInfo") || "{}"
      ).RequestNatureType;
      setUserList(
        getOrderedItems(
          nextProps.categoriesData.data.results,
        ).map((item) => {
          return {
            ...item,
            nature: requestNatureData[item.requestNature]
          };
        })
      );
      setTotal(nextProps.categoriesData.data.rowCount);
    } else {
      setUserList([]);
    }
  }, [nextProps.categoriesData]);

  const fetchData = useCallback(() => {
    let pageData = {
      page: Number(pageIndex) + 1,
      size: pageSize,
    };
    setPageSize(pageSize);
    let payload = { ...pageData, ...filterData };
    dispatch(getCategories(payload));
  }, [pageSize, pageIndex, filterData, dispatch]);

  const mount = useRef(() => {
    fetchData();
  });
  const isSecondRun = useRef(true);
  useEffect(() => {
    if (isSecondRun.current) {
      isSecondRun.current = false;
      return;
    }
    if (nextProps.updateData) {
      mount.current();
    }
  }, [nextProps.updateData]);
  const headers = useMemo(
    () => ({
      nature: TRANSLATE.t("REQUESTS.NATURE_REQUEST"),
      title: TRANSLATE.t("REQUESTS.REQUEST_CATEGORY"),
      isDeactivated: "Statut",
      action: 'Action',
    }),
    []
  );
  const columns = useMemo(
    () => [
      {
        Header: headers.nature,
        accessor: 'nature',
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.title,
        accessor: 'title',
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.isDeactivated,
        accessor: 'isDeactivated',
        disableFilters: true,
        Cell: (row) => {
          if (row.value) {
            return (
              <Badge color='primary' title='click'>
                {TRANSLATE.t('USERS.DEACTIVATED')}
              </Badge>
            );
          }
          return (
            <Badge color='danger' title='click'>
             {TRANSLATE.t('USERS.ACTIVATED')}
            </Badge>
          );
        },
      },
      {
        Header: headers.action,
        accessor: 'action',
        disableFilters: true,
        Cell: (row) => {
          const name = row.row.original.isDeactivated
            ? 'far fa-eye-slash'
            : 'far fa-eye';
          const eventName = row.row.original.isDeactivated
            ? "isPublish"
            : "isUnPublish";
          return (
            <>
              {confirmPermissions("CanToggleUserStatus") &&<button
                type='button'
                className='btn btn-primary'
                onClick={() => {
                  handleUpdateEvent(eventName, row.row.original.id);
                }}
                title={row.row.original.isDeactivated ? TRANSLATE.t('REQUEST_CATEGORY.PUBLISHED') : TRANSLATE.t('REQUEST_CATEGORY.UNPUBLISHED')}
              >
                <i className={name}></i>
              </button>}
              &ensp;
              {confirmPermissions("CanUpdateUser") &&<button
                type='button'
                className='btn btn-success'
                onClick={() => handleCreateAndUpdate(false, row.row.original)}
                title={TRANSLATE.t('REQUEST_CATEGORY.UPDATE_CATEGORY')}
              >
                <i className='fas fa-edit'></i>
              </button>}
              &ensp;
              {confirmPermissions("CanDeleteUser") &&<button
                type='button'
                className='btn btn-danger'
                onClick={() => {
                  handleUpdateEvent('isDelete', row.row.original.id);
                }}
                title={TRANSLATE.t('REQUEST_CATEGORY.DELETE_CATEGORY')}
              >
                <i className='far fa-trash-alt'></i>
              </button>}
            </>
          );
        },
      },
    ],
    [headers]
  );
  const handleCreateAndUpdate = (isCreate, data) => {
    if (isCreate) {
      setAddUserModel(true);
    } else {
      setUpdateUserModel(true);
      setInitialValues(data);
    }
  };
  const handleUpdateEvent = (event, id) => {
    switch (event) {
      case 'isDelete':
        setRecorId(id);
        setDeleteUser(true);
        break;
      case 'isPublish':
        setPublishUserModel(true);
        setRecorId(id);
        break;
      case 'isUnPublish':
        setUnPublishUserModel(true);
        setRecorId(id);
        break;
      default:
        break;
    }
  };
  const callApi = (apiType) => {
    switch (apiType) {
      case 'get':
        fetchData();
        break;
      case 'delete':
        dispatch(deleteCategory({ id: recordId }));
        break;
      case 'publish':
        dispatch(activateCategory({ id: recordId }));
        break;
      case 'unPublish':
          dispatch(inactivateCategory({ id: recordId }));
          break;
      default:
        break;
    }
  };
  /*-----------on filter submit---------*/
  const onFilterSubmit = (formProps) => {
    if (formProps) {
      setFilterData(formProps);
    } else {
      setPageIndex(0);
      setFilterData({});
    }
  };
  return (
    <>
      {addUserModel && (
        <AddCategoryModel
          isOpen={addUserModel}
          handleModal={setAddUserModel}
          callApi={callApi}
          title={TRANSLATE.t('REQUEST_CATEGORY.CREATE_CATEGORY')}
          apiType='get'
          isUpdateEvent={false}
          natureTypes={getRequestNatureTypes()}
        />
      )}
      {updateUserModel && (
        <AddCategoryModel
          isOpen={updateUserModel}
          handleModal={setUpdateUserModel}
          initialValues={{ ...initialValues }}
          callApi={callApi}
          title={TRANSLATE.t('REQUEST_CATEGORY.UPDATE_CATEGORY')}
          isUpdateEvent={true}
          apiType='get'
          natureTypes={getRequestNatureTypes()}
        />
      )}
      {deleteUserModel && (
        <ConfirmationModal
          isOpen={deleteUserModel}
          handleModal={setDeleteUser}
          callApi={callApi}
          apiType='delete'
          title={TRANSLATE.t('REQUEST_CATEGORY.DELETE_CATEGORY')}
          content={TRANSLATE.t('REQUEST_CATEGORY.DELETE_CATEGORY_MESSAGE')}
        />
      )}
      {publishUserModel && (
        <ConfirmationModal
          isOpen={publishUserModel}
          data={{ isPublish: true, recordId }}
          handleModal={setPublishUserModel}
          callApi={callApi}
          apiType='publish'
          title={TRANSLATE.t('REQUEST_CATEGORY.PUBLISH_CATEGORY')}
          content={TRANSLATE.t('REQUEST_CATEGORY.PUBLISH_CATEGORY_MESSAGE')}
        />
      )}
      {unPublishUserModel && (
        <ConfirmationModal
          isOpen={unPublishUserModel}
          data={{ isUnPublish: true, recordId }}
          handleModal={setUnPublishUserModel}
          callApi={callApi}
          apiType='unPublish'
          title={TRANSLATE.t('REQUEST_CATEGORY.UNPUBLISH_CATEGORY')}
          content={TRANSLATE.t('REQUEST_CATEGORY.UNPUBLISH_CATEGORY_MESSAGE')}
        />
      )}
      <div className='mx-3'>
        <Card className='top-margin'>
          <CardHeader>
            <h1>{TRANSLATE.t('REQUEST_CATEGORY.TITLE')}</h1>
            {confirmPermissions("CanCreateUser") &&<Button
              color='primary'
              size='lg'
              onClick={() => handleCreateAndUpdate(true)}
            >
              {TRANSLATE.t('ANNOUNCEMENT.ADD')}
            </Button>}
          </CardHeader>
          <CardBody>
            <Filter isVehicleScreen={true} onFilterSubmit={onFilterSubmit} natureTypes={getRequestNatureTypes()}/>
            <ReactTable
              columns={columns}
              data={userList.length ? userList : []}
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

export default RequestCategoryList;
