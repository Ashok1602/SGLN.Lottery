import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { Row, Col, CardBody, Container, Modal, Label } from 'reactstrap';
// reduxform
import { reduxForm, Field } from 'redux-form';
import { renderTextField, renderSelectField } from '../../components/common/RenderTextField';
// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';
//constants
import { TRANSLATE } from '../../constants';
//helpers
import { renderOptions } from "../../helpers";

const AddSalesPersonModel = (props) => {
  const { title, apiType, callApi } = props;
  const isMassAssignement = true;
  const [selectedMuncipality, setsSelectedMuncipality] = useState(null);

  //for toggle modal
  const toggle = () => {
    props.handleModal();
  };
  //for submit form
  function onSubmit(formData) {
    formData.isMassAssignement = isMassAssignement;
    callApi(apiType, formData);
    // toggle();
  }
  const { handleSubmit } = props;
  return (
    <div>
      <Modal
        className='account-pages my-5 pt-sm-5'
        isOpen={props.isOpen}
        toggle={toggle}
        size='lg'
      >
        <Container>
          <Row className='justify-content-center'>
            <Col style={{ padding: '0' }}>
              <AvForm
                className='form-horizontal'
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className='bg-soft-primary'>
                  <Row>
                    <Col>
                      <div className='modal-header bg-soft-primary'>
                        <i
                          className={'bx bx-user mr-3 ml-1'}
                          style={{ fontSize: '25px' }}
                        ></i>
                        <h5 className='mt-auto text-white'>{title}</h5>
                        <button
                          type='button'
                          className='close'
                          data-dismiss='modal'
                          onClick={toggle}
                        >
                          <span
                            aria-hidden='true'
                            className='close-button text-white'
                          >
                            &times;
                          </span>
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody>
                   {/* <Label>{TRANSLATE.t("RETAILER.SALES_PERSON")}</Label>
                    <Field
                      name="retailer"
                      component={renderSelectField}
                      className="form-control"
                      placeholder={TRANSLATE.t("RETAILER.SELECT_SALES_PERSON")}
                      options={renderOptions(roleWiseUser, "label", "value")}
                    /> */}
                    <Row>
                      <Col>
                      {/* <div className='custom-control custom-checkbox mb-2'>
                        <input
                          type='checkbox'
                          className='custom-control-input mb-2'
                          id='customControlInline'
                          onChange={(e) => setMassAssignment(e.target.checked)}
                        />
                        <label
                          className='custom-control-label'
                          htmlFor='customControlInline'
                        >
                          {TRANSLATE.t('RETAILER.MASS_ASSIGNMENT')}
                        </label>
                      </div> */}
                      {isMassAssignement && <div className='form-group'>
                    <Label>{TRANSLATE.t('RETAILER.SELECT_MUNCIPALITY')}*</Label>
                    <Field
                      name='targetMunicipality'
                      component={renderSelectField}
                      className='form-control'
                      placeholder={
                       TRANSLATE.t('RETAILER.SELECT')
                      }
                      onChange={e => setsSelectedMuncipality(e.target.value)}
                      options={
                        props.muncipalitiesList && props.muncipalitiesList.length && 
                        renderOptions(
                          props.muncipalitiesList.filter(item => item !== null)
                            )
                        
                      }
                    />
                  </div> }
                      </Col>
                    </Row>
                  <Row>
                    <Col md={4} lg={4}>
                      <div className='form-group'>
                        <AvField
                          name='sglnCommercialName'
                          tag={Field}
                          component={renderTextField}
                          label={TRANSLATE.t('RETAILER.ENTER_SGLN_NAME1')}
                          className='form-control'
                          placeholder={TRANSLATE.t('RETAILER.ENTER_SGLN_NAME2')}
                          type='text'
                          validate={{
                            required: {
                              value: true,
                              errorMessage: TRANSLATE.t('ERRORS.REQUIRED'),
                            },
                          }}
                        />
                      </div>
                    </Col>
                    <Col md={4} lg={4}>
                    <div className='form-group'>
                        <AvField
                          name='sglnCommercialMail'
                          tag={Field}
                          component={renderTextField}
                          label={TRANSLATE.t('RETAILER.ENTER_SGLN_EMAIL1')}
                          className='form-control'
                          placeholder={TRANSLATE.t('RETAILER.ENTER_SGLN_EMAIL2')}
                          type='email'
                          validate={{
                            required: {
                              value: true,
                              errorMessage: TRANSLATE.t('ERRORS.REQUIRED'),
                            },
                          }}
                        />
                        
                      </div>
                    </Col>
                    <Col md={4} lg={4}>
                    <div className='form-group'>
                        <AvField
                          name='sglnCommercialPhone'
                          tag={Field}
                          component={renderTextField}
                          label={TRANSLATE.t('RETAILER.SGLN_PHONE1')}
                          className='form-control'
                          placeholder={TRANSLATE.t('RETAILER.SGLN_PHONE2')}
                          type='number'
                          validate={{
                            required: {
                              value: true,
                              errorMessage: TRANSLATE.t('ERRORS.REQUIRED'),
                            },
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} lg={4}>
                      <div className='form-group'>
                        <AvField
                          name='sisalCommercialName'
                          tag={Field}
                          component={renderTextField}
                          label={TRANSLATE.t('RETAILER.ENTER_SISAL_NAME1')}
                          className='form-control'
                          placeholder={TRANSLATE.t('RETAILER.ENTER_SISAL_NAME2')}
                          type='text'
                          validate={{
                            required: {
                              value: true,
                              errorMessage: TRANSLATE.t('ERRORS.REQUIRED'),
                            },
                          }}
                        />
                      </div>
                    </Col>
                    <Col md={4} lg={4}>
                    <div className='form-group'>
                        <AvField
                          name='sisalCommercialMail'
                          tag={Field}
                          component={renderTextField}
                          label={TRANSLATE.t('RETAILER.ENTER_SISAL_EMAIL1')}
                          className='form-control'
                          placeholder={TRANSLATE.t('RETAILER.ENTER_SISAL_EMAIL2')}
                          type='email'
                          validate={{
                            required: {
                              value: true,
                              errorMessage: TRANSLATE.t('ERRORS.REQUIRED'),
                            },
                          }}
                        />
                      </div>
                    </Col>
                    <Col md={4} lg={4}>
                    <div className='form-group'>
                        <AvField
                          name='sisalCommercialPhone'
                          tag={Field}
                          component={renderTextField}
                          label={TRANSLATE.t('RETAILER.SISAL_PHONE1')}
                          className='form-control'
                          placeholder={TRANSLATE.t('RETAILER.SISAL_PHONE2')}
                          type='number'
                          validate={{
                            required: {
                              value: true,
                              errorMessage: TRANSLATE.t('ERRORS.REQUIRED'),
                            },
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <div className='modal-footer'>
                  <button
                    className='btn btn-primary  waves-effect waves-light'
                    type='submit'
                    disabled={isMassAssignement ? !selectedMuncipality : false}
                  >
                    {TRANSLATE.t('ANNOUNCEMENT.SUBMIT')}
                  </button>
                  &ensp;
                  <button
                    className='btn btn-secondary  waves-effect waves-light'
                    type='submit'
                    onClick={toggle}
                  >
                    {TRANSLATE.t('ANNOUNCEMENT.BACK')}
                  </button>
                </div>
              </AvForm>
            </Col>
          </Row>
        </Container>
      </Modal>
    </div>
  );
};

AddSalesPersonModel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  callApi: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  roleWiseUser: PropTypes.array.isRequired,
  apiType: PropTypes.string.isRequired,
  muncipalitiesList: PropTypes.array
};
export default reduxForm({
  form: 'AddSalesPerson',
})(AddSalesPersonModel);
