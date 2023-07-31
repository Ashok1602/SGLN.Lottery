import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUsers,
  deleteUser,
  activateUser,
  inactivateUser,
  getResource,
  // getRole
} from '../../store/actions';
import { getOrderedItems } from '../../helpers';
import { Card, CardHeader, CardBody, Button, Badge } from 'reactstrap';
import ReactTable from '../../components/common/reactTable/TableWithPagination';
import ConfirmationModal from '../../components/common/modals/ConfirmationModal';
import AddUserModel from './AddUserModel';
import Filter from './Filter';
import { TRANSLATE } from '../../constants';
import { confirmPermissions } from '../../helpers';
const Users = () => {
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
  const nextProps = useSelector((state) => ({
    userData: state.Users.data,
    updateData: state.Users.updateData,
    roleData: state.Role.data,
  }));

  useEffect(() => {
    dispatch(getResource());
    // dispatch(getRole());
  }, [dispatch])

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (
      nextProps.userData &&
      nextProps.userData.data &&
      nextProps.userData.data.results
    ) {
      const resourceRolesData = JSON.parse(
        localStorage.getItem("resourceInfo") || "{}"
      ).RoleTranslations;
     
      setUserList(
        getOrderedItems(nextProps.userData.data.results.map((data) => {
          // console.log(resourceRolesData[data.roleName])
          return {
            ...data,
            role:resourceRolesData[data.roleName]
          };
        }))
      );
      setTotal(nextProps.userData.data.rowCount);
    } else {
      setUserList([]);
    }
  }, [nextProps.userData]);
  const fetchData = useCallback(() => {
    let pageData = {
      page: Number(pageIndex) + 1,
      size: pageSize,
    };
    setPageSize(pageSize);
    let payload = { ...pageData, ...filterData };
    dispatch(getUsers(payload));
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
      firstName: TRANSLATE.t('USERS.FIRST_NAME'),
      lastName: TRANSLATE.t('USERS.LAST_NAME'),
      email: 'E-mail',
      userName: TRANSLATE.t('USERS.USERNAME'),
      role: TRANSLATE.t('USERS.ROLE'),
      isDeactivated: TRANSLATE.t('ANNOUNCEMENT.IS_PUBLISHED'),
      action: 'Action',
    }),
    []
  );
  const columns = useMemo(
    () => [
      {
        Header: headers.firstName,
        accessor: 'firstName',
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.lastName,
        accessor: 'lastName',
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.email,
        accessor: 'email',
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.userName,
        accessor: 'userName',
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.role,
        accessor: 'role',
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
                title={row.row.original.isDeactivated ? TRANSLATE.t('ANNOUNCEMENT.PUBLISHED') : TRANSLATE.t('ANNOUNCEMENT.UNPUBLISHED')}
              >
                <i className={name}></i>
              </button>}
              &ensp;
              {confirmPermissions("CanUpdateUser") &&<button
                type='button'
                className='btn btn-success'
                onClick={() => handleCreateAndUpdate(false, row.row.original)}
                title={TRANSLATE.t('USERS.UPDATE_USER')}
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
                title={TRANSLATE.t('USERS.DELETE_USER')}
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
        dispatch(deleteUser({ id: recordId }));
        break;
      case 'publish':
        dispatch(activateUser({ id: recordId }));
        break;
      case 'unPublish':
          dispatch(inactivateUser({ id: recordId }));
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
        <AddUserModel
          isOpen={addUserModel}
          handleModal={setAddUserModel}
          callApi={callApi}
          title={TRANSLATE.t('USERS.ADD_USER')}
          apiType='get'
          isUpdateEvent={false}
        />
      )}
      {updateUserModel && (
        <AddUserModel
          isOpen={updateUserModel}
          handleModal={setUpdateUserModel}
          initialValues={{ ...initialValues }}
          callApi={callApi}
          title={TRANSLATE.t('USERS.UPDATE_USER')}
          isUpdateEvent={true}
          apiType='get'
        />
      )}
      {deleteUserModel && (
        <ConfirmationModal
          isOpen={deleteUserModel}
          handleModal={setDeleteUser}
          callApi={callApi}
          apiType='delete'
          title={TRANSLATE.t('USERS.DELETE_USER')}
          content={TRANSLATE.t('USERS.DELETE_USER_MESSAGE')}
        />
      )}
      {publishUserModel && (
        <ConfirmationModal
          isOpen={publishUserModel}
          data={{ isPublish: true, recordId }}
          handleModal={setPublishUserModel}
          callApi={callApi}
          apiType='publish'
          title={TRANSLATE.t('USERS.PUBLISH_USERS')}
          content={TRANSLATE.t('USERS.PUBLISH_USERS_MESSAGE')}
        />
      )}
      {unPublishUserModel && (
        <ConfirmationModal
          isOpen={unPublishUserModel}
          data={{ isUnPublish: true, recordId }}
          handleModal={setUnPublishUserModel}
          callApi={callApi}
          apiType='unPublish'
          title={TRANSLATE.t('USERS.UNPUBLISH_USERS')}
          content={TRANSLATE.t('USERS.UNPUBLISH_USERS_MESSAGE')}
        />
      )}
      <div className='mx-3'>
        <Card className='top-margin'>
          <CardHeader>
            <h1>{TRANSLATE.t('SIDEBAR_MENU.USERS')}</h1>
            {confirmPermissions("CanCreateUser") &&<Button
              color='primary'
              size='lg'
              onClick={() => handleCreateAndUpdate(true)}
            >
              {TRANSLATE.t('ANNOUNCEMENT.ADD')}
            </Button>}
          </CardHeader>
          <CardBody>
            <Filter isVehicleScreen={true} onFilterSubmit={onFilterSubmit} rolesData={nextProps.roleData}/>
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

export default Users;
