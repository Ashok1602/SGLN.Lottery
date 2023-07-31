import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Card, CardHeader, CardBody, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getNotification, getNotificationById } from "../../store/actions";
import ReactTable from "../../components/common/reactTable/TableWithPagination";
import { requestDateTimeFormat, getOrderedItems, getNotificationTypes } from "../../helpers";
import { DEFAULT_DATE_FORMAT } from "../../constants";
  import Filter from './Filter';
//constants
import { TRANSLATE } from "../../constants";
import AddNotificationModel from "./AddNotificationModel";
import { confirmPermissions } from '../../helpers';

function NotificationList() {
  const [notificationList, setNotificationList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  // const [recordId, setRecorId] = useState(null);
  const [addNotificationModel, setAddNotificationModel] = useState(false);
  const [viewNotificationModel, setViewNotificationModel] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const dispatch = useDispatch();

  const nextProps = useSelector((state) => ({
    notificationData: state.Notification.data,
    notificationDataById: state.Notification.notificationDataById
  }));

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (
      nextProps.notificationData &&
      nextProps.notificationData.data &&
      nextProps.notificationData.data.results
    ) {
      setNotificationList(
        getOrderedItems(
          nextProps.notificationData.data.results,
          "desc",
          "created"
        ).map((item) => {
          return {
            ...item,
            created: requestDateTimeFormat(item.created, DEFAULT_DATE_FORMAT),
            typeInFrench: item.type === "Alert" ? "Alerte" : item.type,
          };
        })
      );
      setTotal(nextProps.notificationData.data.rowCount);
    } else {
      setNotificationList([]);
    }
  }, [nextProps.notificationData]);

  const mount = useRef((data) => {
    setViewNotificationModel(true);
    setInitialValues(data)
  });
  const isSecondRun = useRef(true);
  useEffect(() => {
    if (isSecondRun.current) {
      isSecondRun.current = false;
      return;
    }
    if (nextProps.notificationDataById) {
      mount.current(nextProps.notificationDataById.data);
    }
  }, [nextProps.notificationDataById]);

  const headers = useMemo(
    () => ({
      title: TRANSLATE.t("ANNOUNCEMENT.TITLE"),
      body: TRANSLATE.t("ANNOUNCEMENT.DESCRIPTION"),
      typeInFrench: TRANSLATE.t("NOTIFICATION.TYPE"),
      created: TRANSLATE.t("CREATED"),
      action: TRANSLATE.t('ACTIONS'),
    }),
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: headers.title,
        accessor: "title",
        disableSortBy: true,
        disableFilters: true,
        width: 100,
      },
      {
        Header: headers.body,
        accessor: "body",
        disableSortBy: true,
        disableFilters: true,
        width: 100,
      },
      {
        Header: headers.typeInFrench,
        accessor: "typeInFrench",
        disableFilters: true,
        width: 100,
      },
      {
        Header: headers.created,
        accessor: "created",
        disableFilters: true,
        width: 100,
      },
      {
        Header: headers.action,
        accessor: "action",
        disableFilters: true,
        width: 100,
        Cell: (row) => {
          return (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  dispatch(getNotificationById(row.row.original.id));
                }}
                title={TRANSLATE.t("NOTIFICATION.VIEW_NOTIFICATION")}
              >
                <i className="far fa-eye"></i>
              </button>
              &ensp;
            </>
          );
        },
      },
    ],
    [headers, dispatch]
  );
  /*-----------to fetch api data whenever pagination changes---------*/
  const fetchData = useCallback(() => {
    let pageData = {
      page: Number(pageIndex) + 1,
      size: pageSize,
    };
    setPageSize(pageSize);
    let payload = { ...pageData, ...filterData };
    dispatch(getNotification(payload));
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
      case "get":
        fetchData();
        break;
      default:
        break;
    }
  };
  return (
    <>
      {addNotificationModel && (
        <AddNotificationModel
          isOpen={addNotificationModel}
          handleModal={setAddNotificationModel}
          callApi={callApi}
          title={TRANSLATE.t("NOTIFICATION.CREATE_NOTIFICATION")}
          apiType="get"
          eventType="add"
        />
      )}
      {viewNotificationModel && (
        <AddNotificationModel
          isOpen={viewNotificationModel}
          handleModal={setViewNotificationModel}
          initialValues={initialValues}
          title={TRANSLATE.t("NOTIFICATION.VIEW_NOTIFICATION")}
        />
      )}
      <div className="mx-3">
        <Card className="top-margin">
          <CardHeader>
            <h1>{TRANSLATE.t("NOTIFICATION.NOTIFICATIONS")}</h1>
            {confirmPermissions("CanCreateNotification") && <Button
              color="primary"
              size="lg"
              onClick={() => {
                setAddNotificationModel(true);
              }}
            >
              {TRANSLATE.t("ANNOUNCEMENT.ADD")}
            </Button>}
          </CardHeader>
          <CardBody className="table-col-style">
            <Filter isVehicleScreen={true} onFilterSubmit={onFilterSubmit} notificationTypeData = {getNotificationTypes()} />
            <ReactTable
              columns={columns}
              data={notificationList.length ? notificationList : []}
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
}

export default NotificationList;
