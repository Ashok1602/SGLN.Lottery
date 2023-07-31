import React, { useState } from 'react';
import PropTypes from 'prop-types';
//react-redux
import { useSelector, useDispatch } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button, Row, Col, Label, FormGroup } from 'reactstrap';
import {
  renderTextField,
  renderSelectField,
} from '../../components/common/RenderTextField';
import { getStrippedCategoryByNature } from '../../store/actions';
import CommonCollapse from '../../components/common/Collapse';
//constants
import { TRANSLATE } from '../../constants';
import { renderOptions } from '../../helpers';
function Filter(props) {
  const { natureTypes } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isNatureEmpty, updateIsNatureEmpty] = useState(false);

  const dispatch = useDispatch();

  /*---------------on submit---------------*/
  const onSubmit = (formProps) => {
    props.onFilterSubmit(formProps);
  };

  /*---------------on reset---------------*/
  const onReset = () => {
    props.reset();
    props.onFilterSubmit();
  };

  //get getCategories by nature id
  const getCategories = (nature) => {
    if (nature !== '0') {
      dispatch(getStrippedCategoryByNature(nature));
      updateIsNatureEmpty(false);
    } else {
      updateIsNatureEmpty(true);
    }
  };

  const nextProps = useSelector((state) => ({
    categoriesData: state.RequestCategory.strippedDataByNature,
  }));
  const { handleSubmit, pristine, submitting } = props;
  return (
    <CommonCollapse
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      title={TRANSLATE.t('FILTER.FILTER')}
      className='mx-4 my-1'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={3} className='my-1'>
            <div className='form-group'>
              <Label>Nature</Label>
              <Field
                name='nature'
                component={renderSelectField}
                onChange={(e) => getCategories(e.target.value)}
                className='form-control'
                placeholder={'Select Nature'}
                options={
                  natureTypes && natureTypes.length
                    ? renderOptions(natureTypes, 'label', 'value')
                    : []
                }
              />
            </div>
          </Col>
          <Col md={3} className='my-1'>
            <div className='form-group'>
              <Label>{TRANSLATE.t('REQUESTS.REQUEST_CATEGORY')}</Label>
              <Field
                name='requestCategory'
                component={renderSelectField}
                className='form-control'
                placeholder={TRANSLATE.t('REQUESTS.REQUEST_CATEGORY')}
                options={
                  nextProps.categoriesData && nextProps.categoriesData.length && !isNatureEmpty
                  ? renderOptions(nextProps.categoriesData, "value", "id")
                  : []
                }
              />
            </div>
          </Col>
          <Col md={3} className='my-1'>
            <FormGroup>
              <Label>{TRANSLATE.t('ANNOUNCEMENT.TITLE')}</Label>
              <Field
                name='title'
                component={renderTextField}
                type='text'
                maxLength={25}
                autoCapitalize={'true'}
                placeholder={TRANSLATE.t('ANNOUNCEMENT.TITLE')}
              />
            </FormGroup>
          </Col>
          <Col md={3} className='my-1'>
            <div className=''>
              <Button
                color='primary'
                type='submit'
                className='success-btn px-4 mx-2 mt-2'
                disabled={pristine || submitting}
              >
                {TRANSLATE.t('FILTER.SEARCH')}
              </Button>
              <Button
                color='primary'
                onClick={onReset}
                className='mt-2'
                // disabled={ submitting}
              >
                {TRANSLATE.t('FILTER.RESET')}
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </CommonCollapse>
  );
}
Filter.propTypes = {
  // nextProps: PropTypes.object.isRequired,
  onFilterSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  natureTypes: PropTypes.array.isRequired
};
export default reduxForm({
  form: 'filter', // a unique identifier for this form
})(Filter);
