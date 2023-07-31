import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Card, CardHeader, CardBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getIncentive } from "../../store/actions";
import ReactTable from "../../components/common/reactTable/TableWithPagination";
import Filter from "./Filter";
//constants
import { TRANSLATE } from "../../constants";

const IncentiveLIst = () => {
  const [incentiveLIst, setIncentiveLIst] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();

  const nextProps = useSelector((state) => ({
    docsListData: state.IncentivesModule.data,
  }));
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (nextProps.docsListData && nextProps.docsListData.data) {
      setIncentiveLIst(nextProps.docsListData.data);
      setTotal(nextProps.docsListData.data.length);
    } else {
      setIncentiveLIst([]);
    }
  }, [nextProps.docsListData]);

  const mount = useRef(() => {
    fetchData();
  });
  const isSecondRun = useRef(true);
  useEffect(() => {
    if (isSecondRun.current) {
      isSecondRun.current = false;
      return;
    }
    if (nextProps.deleteDocSuccess) {
      mount.current();
    }
  }, [nextProps.deleteDocSuccess]);

  const headers = useMemo(
    () => ({
      type: "Type",
      goal: TRANSLATE.t("INCENTIVE.GOAL"),
      achievement: TRANSLATE.t("INCENTIVE.ACHIEVEMENT"),
      bonus: TRANSLATE.t("INCENTIVE.BONUS"),
      remains: TRANSLATE.t("INCENTIVE.REMAINS"),
      achievementRate: TRANSLATE.t("INCENTIVE.ACHIEVEMENT_RATE"),
      startDate: TRANSLATE.t("INCENTIVE.START_DATE"),
      endDate: TRANSLATE.t("INCENTIVE.END_DATE"),
    }),
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: headers.type,
        accessor: "type",
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.goal,
        accessor: "goal",
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.achievement,
        accessor: "achievement",
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.bonus,
        accessor: "bonus",
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.remains,
        accessor: "remains",
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.achievementRate,
        accessor: "achievementRate",
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.startDate,
        accessor: "startDate",
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.endDate,
        accessor: "endDate",
        disableSortBy: true,
        disableFilters: true,
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
    dispatch(getIncentive(payload));
  }, [pageSize, pageIndex, filterData, dispatch]);
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
      <div className="mx-3">
        <Card className="top-margin">
          <CardHeader>
            <h1>{TRANSLATE.t("INCENTIVE.INCENTIVES")}</h1>
          </CardHeader>
          <CardBody>
            <Filter onFilterSubmit={onFilterSubmit} />
            <ReactTable
              columns={columns}
              data={incentiveLIst.length ? incentiveLIst : []}
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

export default IncentiveLIst;
