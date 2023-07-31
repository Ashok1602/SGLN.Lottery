import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { Card, CardHeader, CardBody, Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getDocumentList, deleteDocument } from '../../store/actions';
import ReactTable from '../../components/common/reactTable/TableWithPagination';
import { requestDateTimeFormat } from '../../helpers';
import { DEFAULT_DATE_FORMAT } from '../../constants';
import Filter from './Filter';
//constants
import { TRANSLATE } from '../../constants';
// upload modal
import UploadDocModal from './UploadDocModal';
import ConfirmationModal from '../../components/common/modals/ConfirmationModal';
//BASE URL
import { BASE_URL } from '../../actions/config';
import { confirmPermissions } from '../../helpers';

const DocsLIst = () => {
  const [docsList, setDocsList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [docInfo, setDocInfo] = useState(null);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [deleteDocModal, setDeleteDocModel] = useState(false);
  const documentTypeData =
    JSON.parse(localStorage.getItem('resourceInfo') || '{}').DocumentType || {};

  const dispatch = useDispatch();

  const nextProps = useSelector((state) => ({
    docsListData: state.Documents.data,
    deleteDocSuccess: state.Documents.deleteData,
  }));

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const documentTypeData =
      JSON.parse(localStorage.getItem('resourceInfo') || '{}').DocumentType ||
      {};
    if (nextProps.docsListData && nextProps.docsListData.data) {
      setDocsList(
        nextProps.docsListData.data.results.map((item) => {
          return {
            ...item,
            created: requestDateTimeFormat(item.created, DEFAULT_DATE_FORMAT),
            mainType: item.type,
            type: documentTypeData[item.type],
          };
        })
      );
      setTotal(nextProps.docsListData.data.rowCount);
    } else {
      setDocsList([]);
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
      title: TRANSLATE.t('ANNOUNCEMENT.TITLE'),
      type: 'Type',
      created: TRANSLATE.t('CREATED'),
      action: TRANSLATE.t('ACTIONS'),
    }),
    []
  );

  const handleDeleteModal = (rowData) => {
    setDocInfo(rowData);
    setDeleteDocModel(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: headers.title,
        accessor: 'title',
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.type,
        accessor: 'type',
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: headers.created,
        accessor: 'created',
        disableFilters: true,
      },
      {
        Header: headers.action,
        accessor: 'action',
        disableFilters: true,
        width: 100,
        Cell: (data) => {
          return (
            <>
              {confirmPermissions('CanGetApplicationDocuments') && (
                <button
                  type='button'
                  className='btn btn-danger'
                  onClick={() => handleDeleteModal(data.row.original)}
                  title={TRANSLATE.t('DOC_SUPPORT.DELETE_DOC')}
                >
                  <i className='far fa-trash-alt'></i>
                </button>
              )}
              &ensp;
              <a
                href={`${BASE_URL}/documents/download/${data.row.original.mainType}/${data.row.original.id}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <button
                  type='button'
                  className='btn btn-primary'
                  title='Vior Document'
                >
                  <i className='far fa-eye'></i>
                </button>
              </a>
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
    dispatch(getDocumentList(payload));
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

  const handleModal = () => {
    if (docInfo) {
      setDeleteDocModel(!deleteDocModal);
      setDocInfo(null);
    } else {
      setOpenUploadModal(!openUploadModal);
    }
  };

  const callApi = (apiType) => {
    switch (apiType) {
      case 'get':
        fetchData();
        break;
      case 'delete':
        {
          let type;
          for (const key in documentTypeData) {
            if (documentTypeData[key] === docInfo.type) {
              type = key;
              break;
            }
          }
          dispatch(deleteDocument({ type, id: docInfo.id }));
        }
        break;
      default:
        break;
    }
  };
  return (
    <>
      {openUploadModal && (
        <UploadDocModal
          isOpen={openUploadModal}
          handleModal={handleModal}
          callApi={fetchData}
          title={TRANSLATE.t('DOC_SUPPORT.UPLOAD_DOCUMENT')}
          documentType={documentTypeData}
        />
      )}
      {deleteDocModal && (
        <ConfirmationModal
          isOpen={deleteDocModal}
          data={docInfo}
          handleModal={handleModal}
          callApi={callApi}
          apiType='delete'
          title={TRANSLATE.t('DOC_SUPPORT.DELETE_DOC')}
          content={TRANSLATE.t('DOC_SUPPORT.DELETE_DOC_MESSAGE')}
        />
      )}
      <div className='mx-3'>
        <Card className='top-margin'>
          <CardHeader>
            <h1>{TRANSLATE.t('DOC_SUPPORT.TITLE')}</h1>
            {confirmPermissions('CanGetApplicationDocuments') && (
              <Button color='primary' size='lg' onClick={() => handleModal()}>
                {TRANSLATE.t('ANNOUNCEMENT.ADD')}
              </Button>
            )}
          </CardHeader>
          <CardBody>
            <Filter onFilterSubmit={onFilterSubmit} />
            <ReactTable
              columns={columns}
              data={docsList.length ? docsList : []}
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

export default DocsLIst;
