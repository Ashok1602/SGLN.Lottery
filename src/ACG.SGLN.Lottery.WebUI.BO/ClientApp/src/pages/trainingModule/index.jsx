import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Card, CardHeader, CardBody, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getTrainingModules,
  createTrainingModules,
  deleteTrainingModules,
  // getTrainingModuleById,
} from "../../store/actions";
import ReactTable from "../../components/common/reactTable/TableWithPagination";
//constants
import { TRANSLATE } from "../../constants";
import ConfirmationModal from "../../components/common/modals/ConfirmationModal";
import TrainingModule from "./TrainingModule";
import { requestDateTimeFormat } from "../../helpers";
import { DEFAULT_DATE_FORMAT } from "../../constants";
import { confirmPermissions } from '../../helpers';

const TrainingModuleList = () => {
  const [trainingModuleList, setTrainingModuleList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [filterData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [moduleId, setModuleId] = useState(null);
  const [addModuleModal, setAddModuleModal] = useState(false);
  const [deleteModuleModal, setDeleteModuleModal] = useState(false);
  const [viewModuleModal, setViewModuleModal] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const dispatch = useDispatch();

  const nextProps = useSelector((state) => ({
    moduleList: state.TrainingModule.moduleList,
    updateData: state.TrainingModule.updateData,
    moduleById: state.TrainingModule.record,
  }));
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (nextProps.moduleList && nextProps.moduleList.data) {
      setTrainingModuleList(
        nextProps.moduleList.data.map((item) => {
          return {
            ...item,
            created: requestDateTimeFormat(
              item.created,
              DEFAULT_DATE_FORMAT
            ),
          };
        })
      );
      setTotal(nextProps.moduleList.data.length);
    } else {
      setTrainingModuleList([]);
    }
  }, [nextProps.moduleList]);

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

  const findModule = useRef((data) => {
    setViewModuleModal(true);
    setInitialValues(data);
  });
  const isThirdRun = useRef(true);
  useEffect(() => {
    if (isThirdRun.current) {
      isThirdRun.current = false;
      return;
    }
    if (nextProps.moduleById) {
      findModule.current(nextProps.moduleById.data);
    }
  }, [nextProps.moduleById]);

  const headers = useMemo(
    () => ({
      title: TRANSLATE.t("ANNOUNCEMENT.TITLE"),
      countTrainings: TRANSLATE.t("TRAINING_MODULE.TRAINING_COUNT"),
      created: TRANSLATE.t("CREATED"),
      action: TRANSLATE.t('ACTIONS'),
    }),
    []
  );

  const handleEventModal = (rowData) => {
    setModuleId(rowData);
    setDeleteModuleModal(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: headers.title,
        accessor: "title",
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.countTrainings,
        accessor: "countTrainings",
        disableFilters: true,
      },
      {
        Header: headers.created,
        accessor: "created",
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.action,
        accessor: "action",
        disableFilters: true,
        width: 100,
        Cell: (data) => {
          return (
            <>
              {confirmPermissions("CanDeleteTrainingModule") &&<button
                type="button"
                className="btn btn-danger"
                onClick={() => handleEventModal(data.row.original)}
                title={TRANSLATE.t("TRAINING_MODULE.DELETE_MODULE")}
              >
                <i className="far fa-trash-alt"></i>
              </button>}
              &ensp;
              {/* <button
                type="button"
                className="btn btn-primary"
                title={TRANSLATE.t("TRAINING_MODULE.TRAINING_MODULE")}
                onClick={() =>
                  dispatch(getTrainingModuleById(data.row.original.id))
                }
              >
                <i className="far fa-eye"></i>
              </button> */}
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
    dispatch(getTrainingModules(payload));
  }, [pageSize, pageIndex, filterData, dispatch]);
  const handleModal = () => {
    setDeleteModuleModal(!deleteModuleModal);
    setModuleId(null);
  };

  const callApi = (apiType, data) => {
    switch (apiType) {
      case "get":
        fetchData();
        break;
      case "delete":
        dispatch(deleteTrainingModules({ id: moduleId.id }));
        break;
      case "addComment":
        dispatch(createTrainingModules(data));
        break;
      default:
        break;
    }
  };
  return (
    <>
      {deleteModuleModal && (
        <ConfirmationModal
          isOpen={deleteModuleModal}
          data={moduleId}
          handleModal={handleModal}
          callApi={callApi}
          apiType="delete"
          title={TRANSLATE.t("TRAINING_MODULE.DELETE_MODULE")}
          content={TRANSLATE.t("TRAINING_MODULE.DELETE_MODULE_MESSAGE")}
        />
      )}
      {addModuleModal && (
        <TrainingModule
          isOpen={addModuleModal}
          handleModal={setAddModuleModal}
          callApi={callApi}
          apiType="addComment"
          title={TRANSLATE.t("TRAINING_MODULE.ADD_MODULE")}
        />
      )}
      {viewModuleModal && (
        <TrainingModule
          isOpen={viewModuleModal}
          handleModal={setViewModuleModal}
          callApi={callApi}
          apiType="view"
          initialValues={initialValues}
          title={TRANSLATE.t("TRAINING_MODULE.TRAINING_MODULE")}
        />
      )}
      <div className="mx-3">
        <Card className="top-margin">
          <CardHeader>
            <h1>{TRANSLATE.t("TRAINING_MODULE.TRAINING_MODULE")}</h1>
            {confirmPermissions("CanCreateTrainingModule") && <Button
              color="primary"
              size="lg"
              onClick={() => setAddModuleModal(true)}
            >
              {TRANSLATE.t("ANNOUNCEMENT.ADD")}
            </Button>}
          </CardHeader>
          <CardBody>
            <ReactTable
              columns={columns}
              data={trainingModuleList.length ? trainingModuleList : []}
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

export default TrainingModuleList;
