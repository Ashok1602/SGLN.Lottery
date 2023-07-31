import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Label, Col, Card } from 'reactstrap';
import { TRANSLATE } from '../../../constants';
import { BASE_URL } from '../../../actions/config';
import Dropzone from '../../../components/common/Dropzone';
import { ReactSortable } from 'react-sortablejs';
import dragImg from '../../../assets/images/drag-img.png';
import addDocImg from '../../../assets/images/add-doc-img.png';

const SlidesComponent = (props) => {
  const {
    slideListData,
    setSlideList,
    handleRemoveFields,
    id,
    handleAddFields,
    initialValuesData,
    handleFileChange,
    deleteDoc,
    onFileDelete,
  } = props;
  const [slideList, updateSlideList] = useState([]);
  useEffect(() => {
    updateSlideList(slideListData);
  }, [slideListData]);
  const [initialValues, updateInitialValues] = useState(initialValuesData || {});
  useEffect(() => {
    updateInitialValues(initialValuesData);
  }, [initialValuesData]);
  return (
    <>
      <ReactSortable id='1' list={slideList} setList={setSlideList}>
        {slideList.map((field, key) => (
          <Fragment key={field.id || key}>
            <div>
              {key !== 0 && <hr></hr>}
              <Row className='mt-2'>
                <Col md='7'>
                  <span
                    style={{
                      background: '#EBEBEB',
                      borderRadius: '4px',
                      padding: '2px 5px',
                    }}
                  >
                    {key + 1}
                  </span>
                  <Label className='ml-2'>
                    {TRANSLATE.t('ANNOUNCEMENT.DESCRIPTION')}
                  </Label>
                  <textarea
                    rows='5'
                    className='form-control p-2 field-style'
                    defaultValue={field.body}
                    placeholder={
                      id
                        ? field.body
                        : TRANSLATE.t('ANNOUNCEMENT.ENTER_DESCRIPTION')
                    }
                    onChange={(value) => {
                      let items = [...slideList];
                      let item = { ...slideList[key] };
                      item.body = value.target.value;
                      items[key] = item;
                      setSlideList(items);
                    }}
                  />
                </Col>
                <Col md='4'>
                  {(initialValues?.documents || [])[key] ? (
                    // <div className="slides-img">
                    //   <a
                    //     href={`${BASE_URL}/documents/download/${initialValues?.documents[key].type}/${initialValues?.documents[key]?.id}`}
                    //     target="_blank"
                    //     rel="noopener noreferrer"
                    //   >
                    //     <span className="float-left mt-1">
                    //       {initialValues.documents[key].type}
                    //     </span>
                    //   </a>
                    //   <div>
                    //     <div className="pt-2">
                    //       <span
                    //         className="float-right"
                    //         style={{ cursor: "pointer" }}
                    //         onClick={() => deleteDoc(key)}
                    //       >
                    //         <h4 className={"text-danger"}>
                    //           <i className="bx bxs-trash-alt" />
                    //         </h4>
                    //       </span>
                    //     </div>
                    //   </div>
                    // </div>
                    <Card>
                      <img
                        className='slides-img'
                        src={`${BASE_URL}/documents/download/${initialValues?.documents[key].type}/${initialValues?.documents[key]?.id}`}
                        alt={initialValues? initialValues.documents[key].type : "document"}
                      />

                      <div className='py-2 text-center'>
                        <span
                          className={'text-danger'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => deleteDoc(key)}
                        >
                          supprimer
                        </span>
                      </div>
                    </Card>
                  ) : (
                    <div className='mt-4 mt-md-0'>
                      <Label>
                        {TRANSLATE.t('DOC_SUPPORT.UPLOAD_DOCUMENT')}
                      </Label>
                      <div className='custom-file reduce-height'>
                        <Dropzone
                          handleChange={(value) => {
                            handleFileChange(value, key);
                          }}
                          isShowPreview={false}
                          toggle={() => {
                            onFileDelete(key);
                          }}
                          acceptedFiles={[
                            'image/jpeg',
                            'image/jpg',
                            'image/png',
                            'image/bmp',
                          ]}
                          showPreviewsInDropzone={true}
                          showPreviews={false}
                          filesLimit={1}
                        />
                      </div>
                    </div>
                  )}
                </Col>
                <Col md='1' className='mt-1'>
                  <div style={{ marginTop: '30px' }}>
                    <button
                      className='btn btn-danger'
                      onClick={() => {
                        handleRemoveFields(key);
                      }}
                    >
                      <i className='far fa-trash-alt'></i>
                    </button>
                    <img
                      style={{
                        cursor: 'grab',
                      }}
                      className='ml-4'
                      src={dragImg}
                      alt='dragImg'
                    />
                  </div>
                </Col>
                <hr></hr>
              </Row>
            </div>
          </Fragment>
        ))}
      </ReactSortable>
      <Row>
        <div className='add-slides-qustions ml-2 mt-3'>
          <button
            onClick={() => {
              handleAddFields();
            }}
          >
            <img src={addDocImg} alt='addSlidesImg' className='mr-2' />
            {TRANSLATE.t('TRAININGS.ADD_PAGES')}
          </button>
        </div>
      </Row>
    </>
  );
};

SlidesComponent.propTypes = {
  slideListData: PropTypes.array.isRequired,
  setSlideList: PropTypes.func.isRequired,
  handleRemoveFields: PropTypes.func.isRequired,
  id: PropTypes.string,
  handleAddFields: PropTypes.func.isRequired,
  initialValuesData: PropTypes.object,
  handleFileChange: PropTypes.func.isRequired,
  deleteDoc: PropTypes.func.isRequired,
  onFileDelete: PropTypes.func.isRequired,
};
export default SlidesComponent;
