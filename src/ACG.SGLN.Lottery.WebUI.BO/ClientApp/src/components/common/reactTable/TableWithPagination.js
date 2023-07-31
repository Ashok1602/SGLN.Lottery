import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useFilters,
  useSortBy,
  usePagination,
  useResizeColumns,
} from "react-table";
import { Input, Row, Col, Table, Button } from "reactstrap";
import { INDEX_PAGE_SIZE_OPTIONS, TRANSLATE } from "../../../constants";

export const DefaultColumnFilter = ({
  column: {
    filterValue,
    setFilter,
    preFilteredRows: { length },
  },
}) => {
  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`search ${length}`}
    />
  );
};

DefaultColumnFilter.propTypes = {
  column: PropTypes.object.isRequired
}

// Our table component
// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
function TableContainer({
  columns,
  data,
  pageCount: controlledPageCount,
  fetchData,
  currentPage,
  clickHandler,
  total,
  setPageIndex,
  pageSizeData,
  setPageSize,
}) {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    pageOptions,
    // pageCount,
    previousPage,
    canPreviousPage,
    canNextPage,
    // setPageSize,
    gotoPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      manualPagination: true,
      initialState: { pageIndex: currentPage },
      pageCount: controlledPageCount,
    },
    useFilters, // useFilters!
    useSortBy,
    usePagination,
    useResizeColumns
  );
  //handle previous page
  const handlePrevious = () => {
    setPageIndex(pageIndex - 1);
    previousPage();
  };

  //handle next page
  const handleNext = () => {
    setPageIndex(pageIndex + 1);
    nextPage();
  };

  let pageSelectData = Array.apply(null, Array(pageOptions.length)).map(
    function () {
      return null;
    }
  );

  // Listen for changes in pagination and use the state to fetch our new data
  useEffect(() => {
    fetchData();
  }, [fetchData, pageIndex]);

  return (
    <>
      <div>
        <Table
          {...getTableProps()}
          className="bg-white text-center  mb-0 table-responsive-md"
        >
          <thead className="rt-thead -header tableHeader ">
            {headerGroups.map((headerGroup, key) => (
              <tr key={key} {...headerGroup.getHeaderGroupProps()} className="rt-tr">
                {headerGroup.headers.map((column, key) => (
                  <th
                    key={key}
                    className="p-2 header-textcolor pt-1 "
                    // style={headerstyle}
                    {...column.getHeaderProps({
                      style: { minWidth: column.minWidth, width: column.width },
                    })}
                  >
                    <div className="rt-resizable-header-content">
                      {column.render("Header")}
                    </div>
                    {/* Render the columns filter UI */}
                    <div>
                      {headerGroup.headers.length - 1 === key
                        ? null
                        : column.canFilter
                        ? column.render("Filter")
                        : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.length
              ? page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr
                      key={i}
                      {...row.getRowProps()}
                      className={clickHandler ? "cursor-pointer" : ""}
                      onClick={
                        clickHandler
                          ? () => clickHandler(row)
                          : () => {
                              return false;
                            }
                      }
                    >
                      {row.cells.map((cell, key) => {
                        return (
                          <td key={key} {...cell.getCellProps()} className="rt-td">
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              : null}
            {!data.length && (
              <tr className="text-center">
                <td colSpan="10000" className="text-center">
                  <h5>
                    <b>{TRANSLATE.t('NO_RECORDS_FOUND')}</b>
                  </h5>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {data.length ? (
          <div className="rt-pagination">
            <div className="-previous">
              <Button
                className="btn-light full-width"
                color="#ffffff"
                onClick={handlePrevious}
                disabled={!canPreviousPage}
              >
                {TRANSLATE.t('PREVIOUS_BUTTON')}
              </Button>
            </div>
            <div className="-center">
              <Row
                style={{
                  display: "contents",
                }}
              >
                <Col xs={12} sm={6} md={2}>
                  <span>
                    {TRANSLATE.t('TOTAL')}{" "}
                    <strong>{total ? total : 0}</strong>{" "}
                  </span>
                </Col>
                <Col xs={12} sm={6} md={5}>
                  {" "}
                  {/* <span className="ml-3"> */}
                  {TRANSLATE.t('PAGE')}{" "}
                  <Input
                    type="select"
                    className="page-select"
                    value={pageIndex}
                    onChange={(event) => {
                      gotoPage(event.target.value);
                      setPageIndex(event.target.value);
                    }}
                  >
                    {pageSelectData.map((prop, key) => {
                      return (
                        <option key={key} value={key}>
                          {key + 1}
                        </option>
                      );
                    })}
                  </Input>
                  {TRANSLATE.t("OF")} {pageOptions.length}
                  {/* </span> */}
                </Col>
                <Col xs={12} sm={6} md={5}>
                  {" "}
                  <Input
                    type="select"
                    className="page-select"
                    value={pageSizeData}
                    onChange={(event) => {
                      setPageSize(parseInt(event.target.value));
                    }}
                  >
                    {INDEX_PAGE_SIZE_OPTIONS.map((newPageSize) => {
                      return (
                        <option key={newPageSize} value={newPageSize}>
                          {newPageSize}
                        </option>
                      );
                    })}
                  </Input>
                  {TRANSLATE.t('ROWS')}
                </Col>
              </Row>
            </div>
            <div className="-next">
              <Button
                color="#ffffff"
                className="btn-light full-width"
                onClick={handleNext}
                disabled={!canNextPage}
              >
                {TRANSLATE.t('NEXT_BUTTON')}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

// Define a custom filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== "number";

TableContainer.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  pageCount: PropTypes.number.isRequired,
  fetchData: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  clickHandler: PropTypes.func,
  total: PropTypes.number.isRequired,
  setPageIndex: PropTypes.func.isRequired,
  pageSizeData: PropTypes.number.isRequired,
  setPageSize: PropTypes.func.isRequired,
}

export default TableContainer;
