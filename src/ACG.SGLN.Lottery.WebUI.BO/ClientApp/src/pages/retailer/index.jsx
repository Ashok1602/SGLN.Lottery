import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardBody, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getRetailer, getMuncipalities, massAssignment} from "../../store/actions";
import { requestDateTimeFormat } from "../../helpers";
import { TRANSLATE, DEFAULT_DATE_FORMAT } from "../../constants";
import ReactTable from "../../components/common/reactTable/TableWithPagination";
import Filter from "./Filter";
import AssignSalesPersonModel from './AssignSalesPersonModel';

const Retailer = (props) => {
  const dispatch = useDispatch();
  const [retailerList, setRetailerList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [assignSalesPersonConfirm, setAssignSalesPersonConfirm] =
  useState(false);

  useEffect(() => {
   
    dispatch(getMuncipalities());
  }, [dispatch]);

  const nextProps = useSelector((state) => ({
    retailerListData: state.Retailer.data,
    muncipalitiesData: state.Retailer.muncipalitiesData,
    massAssignmentData: state.Retailer.massAssignmentData,
  }));

  const isAssigned = useRef(true);
  useEffect(() => {
    if (isAssigned.current) {
      isAssigned.current = false;
      return;
    }
    if (nextProps.massAssignmentData) {
      setAssignSalesPersonConfirm(!assignSalesPersonConfirm);
    }
  }, [nextProps.massAssignmentData]);

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (
      nextProps.retailerListData &&
      nextProps.retailerListData &&
      nextProps.retailerListData.results
    ) {
      setRetailerList(
        nextProps.retailerListData.results.map((item) => {
          return {
            ...item,
            created: requestDateTimeFormat(item.created, DEFAULT_DATE_FORMAT),
            isNotified: item.isNotified ? TRANSLATE.t("YES"):  TRANSLATE.t("NO")
          };
        })
      );
      setTotal(nextProps.retailerListData.rowCount);
    } else {
      setRetailerList([]);
    }
  }, [nextProps.retailerListData]);
  const headers = useMemo(
    () => ({
      lastName: TRANSLATE.t("REQUESTS.LAST_NAME"),
      firstName: TRANSLATE.t("REQUESTS.FIRST_NAME"),
      email: "E-Mail",
      isNotified: TRANSLATE.t("REQUESTS.IS_NOTIFIED"),
      phone: TRANSLATE.t("USERS.PHONE_NUMBER"),
      created: TRANSLATE.t("CREATED"),
    }),
    []
  );
  const columns = useMemo(
    () => [
      {
        Header: headers.lastName,
        accessor: "lastName",
        disableSortBy: true,
        disableFilters: true,
        width: 100,
      },
      {
        Header: headers.firstName,
        accessor: "firstName",
        disableSortBy: true,
        disableFilters: true,
        width: 100,
      },
      {
        Header: headers.email,
        accessor: "email",
        disableSortBy: true,
        disableFilters: true,
        width: 100,
      },
      {
        Header: headers.isNotified,
        accessor: "isNotified",
        disableSortBy: true,
        disableFilters: true,
        width: 100,
      },
      {
        Header: headers.phone,
        accessor: "phone",
        disableSortBy: true,
        disableFilters: true,
        width: 100,
      },
      {
        Header: headers.created,
        accessor: "created",
        disableSortBy: true,
        disableFilters: true,
        width: 100,
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
    dispatch(getRetailer(payload));
  }, [pageSize, pageIndex, filterData, dispatch]);
  /*-----------on filter submit---------*/
  const onFilterSubmit = (formProps) => {
    if (formProps) {
      let formData = { ...formProps };
      if (formData.isNotified) {
        formData.isNotified = formData.isNotified === "Yes" ? true : false;
      }
      setFilterData(formData);
    } else {
      setPageIndex(0);
      setFilterData({});
    }
  };
  const clickHandler = (e) => {
    props.history.push(`/retailerDetails/${e.original.id}`);
  };

  const callApi = (apiType, data) => {
    switch (apiType) {
      case 'massAssignment':
        dispatch(massAssignment({formData: data }))
        break;
      default:
        break;
    }
  };
  return (
    <>
      <div className="mx-3">
      {assignSalesPersonConfirm && (
        <AssignSalesPersonModel
          isOpen={assignSalesPersonConfirm}
          handleModal={setAssignSalesPersonConfirm}
          callApi={callApi}
          apiType='massAssignment'
          title={TRANSLATE.t('RETAILER.ASSIGN_SALES_PERSON')}
          initialValues={{}}
          muncipalitiesList={nextProps.muncipalitiesData || []}
        />
      )}
        <Card className="top-margin">
          <CardHeader>
            <h1>{TRANSLATE.t("RETAILER.RETAILER")}</h1>
            <Button color="primary" size="lg" onClick={() => setAssignSalesPersonConfirm(!assignSalesPersonConfirm)}>
              {TRANSLATE.t("RETAILER.BULK_ASSIGNMENT")}
            </Button>
          </CardHeader>
          <CardBody className="table-col-style">
            <Filter isVehicleScreen={true} onFilterSubmit={onFilterSubmit} />
            <ReactTable
              columns={columns}
              data={retailerList.length ? retailerList : []}
              pageCount={total ? Math.ceil(total / pageSize) : 0}
              setPageSize={setPageSize}
              fetchData={fetchData}
              currentPage={pageIndex}
              total={total}
              setPageIndex={setPageIndex}
              pageSizeData={pageSize}
              clickHandler={clickHandler}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};
Retailer.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Retailer;
