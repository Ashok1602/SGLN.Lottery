import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardBody, Button, Badge } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getTrainings,
  getStrippedModules,
  publishTraining,
  unPublishTraining,
} from "../../../store/actions";
import ReactTable from "../../../components/common/reactTable/TableWithPagination";
import { requestDateTimeFormat, getOrderedItems } from "../../../helpers";
import Filter from "../Filter";
import { TRANSLATE, DEFAULT_DATE_FORMAT } from "../../../constants";
import ConfirmationModal from "../../../components/common/modals/ConfirmationModal";
import { confirmPermissions } from '../../../helpers';

function InteractiveTrainingList(props) {
  const [trainingsList, setTrainingsList] = useState([]);
  const [modulesList, setModuleList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filterData, setFilterData] = useState({});
  const [activateTrainingModel, setActivateTrainingModel] = useState(false);
  const [inActivateTrainingModel, setInActivateTrainingModel] = useState(false);
  const [trainingId, setTrainingId] = useState(null);
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
      view: "Action",
      isPublished: TRANSLATE.t("ANNOUNCEMENT.IS_PUBLISHED"),
    }),
    []
  );

  const clickHandler = useCallback(
    (e = {}) => {
      let url = "/interactiveTrainingDetails";
      if (e.original && e.original.id) {
        url += `?id=${e.original.id}`;
      }
      props.history.push(url);
    },
    [props.history]
  );
  const callApi = (apiType) => {
    switch (apiType) {
      case "publish":
        dispatch(publishTraining({ id: trainingId }));
        break;
      case "unPublish":
        dispatch(unPublishTraining({ id: trainingId }));
        break;
      default:
        break;
    }
  };
  const handlePublishAndUnPublish = (event) => {
    if (event === "isUnPublish") {
      setActivateTrainingModel(true);
    } else if (event === "isPublish") {
      setInActivateTrainingModel(true);
    }
  };
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
        Header: headers.view,
        accessor: "view",
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
               {confirmPermissions("CanToggleTrainingStatus") && <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handlePublishAndUnPublish(eventName, row.row.original.id);
                  setTrainingId(row.row.original.id);
                }}
                title={
                  row.row.original.isPublished
                    ? TRANSLATE.t("ANNOUNCEMENT.UNPUBLISHED")
                    : TRANSLATE.t("ANNOUNCEMENT.PUBLISHED")
                }
              >
                <i className={name}></i>
              </button>}
              &ensp;
              {confirmPermissions("CanEditInteractiveTraining") && <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  clickHandler(row.row);
                }}
                title={TRANSLATE.t("TRAININGS.UPDATE_TRAINING")}
              >
                <i className="fas fa-edit"></i>
              </button>}
            </>
          );
        },
      },
    ],
    [headers, clickHandler]
  );
  /*-----------to fetch api data whenever pagination changes---------*/
  const fetchData = useCallback(() => {
    let pageData = {
      page: Number(pageIndex) + 1,
      size: pageSize,
      trainingType: "Interactive",
    };
    setPageSize(pageSize);
    let payload = { ...pageData, ...filterData };
    dispatch(getTrainings(payload));
    dispatch(getStrippedModules());
  }, [pageSize, pageIndex, dispatch, filterData]);

  // hande publish/unpublish event
  const isSecondRun = useRef(true);
  useEffect(() => {
    if (isSecondRun.current) {
      isSecondRun.current = false;
      return;
    }
    if (nextProps.updatedData) {
      fetchData();
    }
  }, [nextProps.updatedData, fetchData]);
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
  return (
    <>
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
            <h1>{TRANSLATE.t("TRAININGS.INTERACTIVE_TRAINING")}</h1>
            {confirmPermissions("CanCreateInteractiveTraining") && <Button
              color="primary"
              size="lg"
              onClick={() => {
                clickHandler();
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
              isRemoveModule={false}
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
              // clickHandler={clickHandler}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
InteractiveTrainingList.propTypes = {
  history: PropTypes.object.isRequired,
};
export default InteractiveTrainingList;
