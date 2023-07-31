import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import {
  useTable,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import { Table, Row, Col, Input, Button } from "reactstrap";
import { Filter, DefaultColumnFilter } from "./TableFilters";
import { INDEX_PAGE_SIZE_OPTIONS, TRANSLATE } from "../../../constants";

const TableContainer = ({
  columns,
  data,
  rowClickHandler,
  renderRowSubComponent,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
  };

  const onPageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
  };

  const onPageChange = (event) => {
    const newPage = event.target.value ? Number(event.target.value) : 0;
    gotoPage(newPage);
  };
  return (
    <Fragment>
      <div className="table">
        <Table
          className="bg-white text-center  mb-0 table-responsive-md"
          {...getTableProps()}
        >
          <thead className="tableHeader">
            {headerGroups.map((headerGroup, key) => (
              <tr key={key} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, key) => (
                  <th
                    key={key}
                    className="p-2 header-textcolor pt-1 "
                    // style={headerstyle}
                    {...column.getHeaderProps()}
                  >
                    <div {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </div>
                    <Filter column={column} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);

                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr
                      onClick={() =>
                        rowClickHandler
                          ? rowClickHandler(row.original)
                          : () => {
                              return false;
                            }
                      }
                      className={rowClickHandler ? "cursor-pointer" : ""}
                    >
                      {row.cells.map((cell, key) => {
                        return (
                          <td key={key} {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                    {row.isExpanded && (
                      <tr>
                        <td colSpan={visibleColumns.length}>
                          {renderRowSubComponent(row)}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          }
        </Table>

        {!data.length && (
          <div className="text-center">
            {" "}
            <h5>
              <b>{TRANSLATE.t('NO_RECORDS_FOUND')}</b>
            </h5>
          </div>
        )}
      </div>

      {data.length >= 10 && (
        <Row className="mt-3">
          <div className="justify-center mx-3">
            <FaAngleDoubleLeft
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            />
          </div>
          <Col>
            {" "}
            <Button
              color="#ffffff"
              className="btn-light full-width"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              {"Return"}
            </Button>
          </Col>
          <Col md="auto" className="justify-center">
            <span>
              {"Total"}{" "}
              <strong>{data.length ? data.length : 0}</strong>{" "}
            </span>
          </Col>
          <Col md="auto">
            {" "}
            <span className="ml-3">
              {"Page"}{" "}
              <Input
                type="select"
                className="page-select"
                value={pageIndex}
                min={1}
                max={pageOptions.length}
                onChange={onPageChange}
              >
                {pageOptions.map((newPageSize) => (
                  <option key={newPageSize} value={newPageSize}>
                    {newPageSize + 1}
                  </option>
                ))}
              </Input>
              {TRANSLATE.t("OF")} {pageOptions.length}
            </span>
          </Col>

          <Col md="auto">
            {" "}
            <Input
              type="select"
              className="page-select"
              value={pageSize}
              onChange={onPageSizeChange}
            >
              {INDEX_PAGE_SIZE_OPTIONS.map((newPageSize) => {
                return (
                  <option key={newPageSize} value={newPageSize}>
                    {newPageSize}
                  </option>
                );
              })}
            </Input>
            {"Lines"}
          </Col>
          <Col>
            {" "}
            <Button
              color="#ffffff"
              className="btn-light full-width"
              onClick={nextPage}
              disabled={!canNextPage}
            >
              {"Following"}
            </Button>
          </Col>
          <div className="justify-center mx-3">
            <FaAngleDoubleRight
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            />
          </div>
        </Row>
      )}
    </Fragment>
  );
};
TableContainer.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  rowClickHandler: PropTypes.func,
  renderRowSubComponent: PropTypes.func,
};

export default withNamespaces()(TableContainer);
