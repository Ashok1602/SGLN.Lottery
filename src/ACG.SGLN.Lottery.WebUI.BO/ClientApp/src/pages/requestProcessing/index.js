import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, Badge } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getRequests, getStrippedCategory } from '../../store/actions';
import ReactTable from '../../components/common/reactTable/TableWithPagination';
import {
  requestDateTimeFormat,
  getOrderedItems,
  getRequestStatusTypes,
  getRequestNatureTypes,
} from '../../helpers';
import { DEFAULT_DATE_FORMAT } from '../../constants';
import Filter from './Filter';
//constants
import { TRANSLATE } from '../../constants';
const RequestList = (props) => {
  const [announcementList, setAnnouncementList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [pageSize, setPageSize] = useState(10);

  const requestStatusTypesData = JSON.parse(
    localStorage.getItem('resourceInfo') || '{}'
  ).RequestStatusType;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStrippedCategory());
  }, [dispatch]);

  const nextProps = useSelector((state) => ({
    announcementData: state.Requests.data,
    categoriesList: state.RequestCategory.strippedData,
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
      const requestNatureData = JSON.parse(
        localStorage.getItem('resourceInfo') || '{}'
      ).RequestNatureType;

      setAnnouncementList(
        getOrderedItems(
          nextProps.announcementData.data.results,
          'desc',
          'created'
        ).map((item) => {
          return {
            ...item,
            requestNature: item.requestNature
              ? requestNatureData[item.requestNature]
              : '',
            created: requestDateTimeFormat(item.created, DEFAULT_DATE_FORMAT),
            requestCategory: item.requestCategory?.title,
            requestObject: item.requestObject.split('|')[1] || '',
          };
        })
      );
      setTotal(nextProps.announcementData.data.rowCount);
    } else {
      setAnnouncementList([]);
    }
  }, [nextProps.announcementData]);

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
      requestNature: TRANSLATE.t('REQUESTS.NATURE_REQUEST'),
      requestCategory: TRANSLATE.t('REQUESTS.REQUEST_CATEGORY'),
      requestObject: TRANSLATE.t('REQUESTS.REQUEST_OBJECT'),
      created: TRANSLATE.t('CREATED'),
      lastStatus: TRANSLATE.t('STATUS'),
    }),
    []
  );

  //get color code for exact status
  const getCustomColor = (value) => {
    switch (value) {
      case 'Fermé':
        return 'danger';
      case 'Clôturée':
        return 'success';
      case 'En cours':
        return 'primary';
      case 'Envoyée':
        return 'info';
      case 'Contestée':
        return 'danger';
      case 'Annulée':
        return 'secondary';
      default:
        return 'primary';
    }
  };
  const columns = useMemo(
    () => [
      {
        Header: headers.requestNature,
        accessor: 'requestNature',
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.requestCategory,
        accessor: 'requestCategory',
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.requestObject,
        accessor: 'requestObject',
        disableSortBy: true,
        disableFilters: true,
      },
      // {
      //   Header: headers.requestAssignedTo,
      //   accessor: "requestAssignedTo",
      //   disableSortBy: true,
      //   disableFilters: true,
      // },
      {
        Header: headers.created,
        accessor: 'created',
        disableFilters: true,
      },
      {
        Header: headers.lastStatus,
        accessor: 'lastStatus',
        disableFilters: true,
        Cell: (row) => {
          if (requestStatusTypesData) {
            return (
              <h5>
                <Badge
                  color={getCustomColor(requestStatusTypesData[row.value])}
                >
                  {requestStatusTypesData[row.value]}
                </Badge>
              </h5>
            );
          } else {
            return <></>;
          }
        },
      },
    ],
    [headers, requestStatusTypesData]
  );
  /*-----------to fetch api data whenever pagination changes---------*/
  const fetchData = useCallback(() => {
    let pageData = {
      page: Number(pageIndex) + 1,
      size: pageSize,
    };
    setPageSize(pageSize);
    let payload = { ...pageData, ...filterData };
    dispatch(getRequests(payload));
  }, [pageSize, pageIndex, filterData, dispatch]);
  /*-----------on filter submit---------*/
  const onFilterSubmit = (formProps) => {
    if (formProps) {
      let formData = { ...formProps };
      if (formData.isNotified) {
        formData.isNotified = formData.isNotified === 'Yes' ? true : false;
      }
      setFilterData(formData);
    } else {
      setPageIndex(0);
      setFilterData({});
    }
  };
  const clickHandler = (e) => {
    props.history.push(`/requestDetails/${e.original.id}`);
  };
  return (
    <>
      <div className='mx-3'>
        <Card className='top-margin'>
          <CardHeader>
            <h1>{TRANSLATE.t('REQUESTS.REQUESTS')}</h1>
          </CardHeader>
          <CardBody>
            <Filter
              isVehicleScreen={true}
              onFilterSubmit={onFilterSubmit}
              lastStatusData={getRequestStatusTypes()}
              requestNatureData={getRequestNatureTypes()}
              requestCategoryData={nextProps.categoriesList || []}
            />
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
              clickHandler={clickHandler}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};
RequestList.propTypes = {
  history: PropTypes.object.isRequired,
};
export default RequestList;
