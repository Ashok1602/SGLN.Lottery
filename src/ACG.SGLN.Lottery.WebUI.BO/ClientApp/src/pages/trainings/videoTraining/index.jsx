import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Card, CardHeader, CardBody, Button, Badge } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getTrainings,
  getTrainingById,
  publishTraining,
  unPublishTraining,
} from "../../../store/actions";
import ReactTable from "../../../components/common/reactTable/TableWithPagination";
import { requestDateTimeFormat, getOrderedItems } from "../../../helpers";
import Filter from "../Filter";
//constants
import { TRANSLATE, DEFAULT_DATE_FORMAT } from "../../../constants";
import AddVideoTrainingModal from "./AddVideoTraining";
import ConfirmationModal from "../../../components/common/modals/ConfirmationModal";
import { confirmPermissions } from '../../../helpers';

function VideoTrainingList() {
  const [trainingsList, setTrainingsList] = useState([]);
  const [modulesList, setModuleList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filterData, setFilterData] = useState({});
  // const [recordId, setRecorId] = useState(null);
  const [addNotificationModel, setAddNotificationModel] = useState(false);
  const [viewNotificationModel, setViewNotificationModel] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [activateTrainingModel, setActivateTrainingModel] = useState(false);
  const [inActivateTrainingModel, setInActivateTrainingModel] = useState(false);
  const [recordId, setRecorId] = useState(null);
  const [isView, setIsView] = useState(false);

  const dispatch = useDispatch();

  const nextProps = useSelector((state) => ({
    traningsData: state.Trainings.data,
    trainingDataById: state.Trainings.dataById,
    updatedData: state.Trainings.updateData,
    strippedModules: state.TrainingModule.data,
  }));

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (
      nextProps.traningsData &&
      nextProps.traningsData.data &&
      nextProps.traningsData.data.results
    ) {
      setTrainingsList(
        getOrderedItems(
          nextProps.traningsData.data.results,
          "desc",
          "created"
        ).map((item) => {
          return {
            ...item,
            created: requestDateTimeFormat(item.created, DEFAULT_DATE_FORMAT),
          };
        })
      );
      setTotal(nextProps.traningsData.data.rowCount);
    } else {
      setTrainingsList([]);
    }
  }, [nextProps.traningsData]);

  const mount = useRef((data) => {
    setViewNotificationModel(true);
    setInitialValues(data);
  });
  const isSecondRun = useRef(true);
  useEffect(() => {
    if (isSecondRun.current) {
      isSecondRun.current = false;
      return;
    }
    if (nextProps.trainingDataById) {
      mount.current(nextProps.trainingDataById.data);
    }
  }, [nextProps.trainingDataById]);

  const updatedMount = useRef(() => {
    fetchData();
  });
  const updatedRun = useRef(true);
  useEffect(() => {
    if (updatedRun.current) {
      updatedRun.current = false;
      return;
    }
    if (nextProps.updatedData) {
      updatedMount.current();
    }
  }, [nextProps.updatedData]);

  const isThirdRun = useRef(true);
  useEffect(() => {
    if (isThirdRun.current) {
      isThirdRun.current = false;
      return;
    }
    if (nextProps.strippedModules && nextProps.strippedModules.length) {
      setModuleList(
        nextProps.strippedModules.map((data) => {
          return {
            value: data.id,
            label: data.value,
          };
        })
      );
    }
  }, [nextProps.strippedModules]);

  const headers = useMemo(
    () => ({
      title: TRANSLATE.t("ANNOUNCEMENT.TITLE"),
      created: TRANSLATE.t("CREATED"),
      action: TRANSLATE.t('ACTIONS'),
      isPublished: TRANSLATE.t("ANNOUNCEMENT.IS_PUBLISHED"),
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
        Header: headers.created,
        accessor: "created",
        disableFilters: true,
        width: 100,
      },
      {
        Header: headers.isPublished,
        accessor: "isPublished",
        disableFilters: true,
        width: 100,
        Cell: (row) => {
          if (row.value) {
            return (
              <h5>
                <Badge color="primary" title="click">
                  {" "}
                  {TRANSLATE.t("ANNOUNCEMENT.PUBLISHED")}
                </Badge>
              </h5>
            );
          }
          return (
            <h5>
              <Badge color="danger" title="click">
                {TRANSLATE.t("ANNOUNCEMENT.UNPUBLISHED")}
              </Badge>
            </h5>
          );
        },
      },
      {
        Header: headers.action,
        accessor: "action",
        disableFilters: true,
        width: 100,
        Cell: (row) => {
          const name = row.row.original.isPublished
            ? "far fa-eye"
            : "far fa-eye-slash";
          const eventName = !row.row.original.isPublished
            ? "isUnPublish"
            : "isPublish";
          return (
            <>
              {confirmPermissions("CanToggleTrainingStatus") &&<button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handlePublishAndUnPublish(eventName, row.row.original.id);
                }}
                title={
                  !row.row.original.isPublished
                    ? TRANSLATE.t("ANNOUNCEMENT.PUBLISHED")
                    : TRANSLATE.t("ANNOUNCEMENT.UNPUBLISHED")
                }
              >
                <i className={name}></i>
              </button>}
              &ensp;
              {confirmPermissions("CanEditVideoTraining") &&<button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  dispatch(getTrainingById(row.row.original.id));
                }}
                title={"Modify"}
              >
                <i className="fas fa-edit"></i>
              </button>}
              {/* &ensp;
              <button
                type='button'
                className='btn btn-info'
                onClick={() => {
                  setIsView(true);
                  dispatch(getTrainingById(row.row.original.id));
                }}
                title={"view"}
              >
                <i className='fas fa-file'></i>
              </button> */}
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
      trainingType: "Video",
    };
    setPageSize(pageSize);
    let payload = { ...pageData, ...filterData };
    dispatch(getTrainings(payload));
  }, [pageSize, pageIndex, dispatch, filterData]);
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

  const handlePublishAndUnPublish = (event, id) => {
    if (event === "isUnPublish") {
      setActivateTrainingModel(true);
      setRecorId(id);
    } else if (event === "isPublish") {
      setInActivateTrainingModel(true);
      setRecorId(id);
    }
  };

  const callApi = (apiType) => {
    switch (apiType) {
      case "get":
        fetchData();
        break;
      case "publish":
        dispatch(publishTraining({ id: recordId }));
        break;
      case "unPublish":
        dispatch(unPublishTraining({ id: recordId }));
        break;
      default:
        break;
    }
  };
  const handleViewModel = () => {
    setViewNotificationModel(false);
    setIsView(false);
  };
  return (
    <>
      {addNotificationModel && (
        <AddVideoTrainingModal
          isOpen={addNotificationModel}
          handleModal={setAddNotificationModel}
          callApi={callApi}
          title={TRANSLATE.t("TRAININGS.ADD_VIDEO_TRAINING")}
          apiType="get"
          eventType={isView ? "view" : "update"}
        />
      )}
      {viewNotificationModel && (
        <AddVideoTrainingModal
          isOpen={viewNotificationModel}
          handleModal={handleViewModel}
          initialValues={initialValues}
          callApi={callApi}
          apiType="get"
          title={TRANSLATE.t("TRAININGS.UPDATE_VIDEO_TRAINING")}
          eventType={isView ? "view" : "update"}
        />
      )}
      {activateTrainingModel && (
        <ConfirmationModal
          isOpen={activateTrainingModel}
          handleModal={setActivateTrainingModel}
          callApi={callApi}
          apiType="publish"
          title={TRANSLATE.t("TRAININGS.ACTIVATE_TRAINING")}
          content={TRANSLATE.t("TRAININGS.ACTIVATE_TRAINING_MESSAGE")}
        />
      )}
      {inActivateTrainingModel && (
        <ConfirmationModal
          isOpen={inActivateTrainingModel}
          data={{ isUnPublish: true, recordId }}
          handleModal={setInActivateTrainingModel}
          callApi={callApi}
          apiType="unPublish"
          title={TRANSLATE.t("TRAININGS.INACTIVATE_TRAINING")}
          content={TRANSLATE.t("TRAININGS.INACTIVATE_TRAINING_MESSAGE")}
        />
      )}
      <div className="mx-3">
        <Card className="top-margin">
          <CardHeader>
            <h1>{TRANSLATE.t("TRAININGS.TITLE")}</h1>
            {confirmPermissions("CanCreateVideoTraining") && <Button
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
            <Filter
              isVehicleScreen={true}
              onFilterSubmit={onFilterSubmit}
              modulesList={modulesList}
              isRemoveModule={true}
            />
            <ReactTable
              columns={columns}
              data={trainingsList.length ? trainingsList : []}
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

export default VideoTrainingList;
