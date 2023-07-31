import React from 'react';
import { Card, CardBody, CardTitle, Media, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import attachmentLogo from '../../assets/images/attachment-logo.png';
import documentLogo from '../../assets/images/document.png';
import cameraLogo from '../../assets/images/photo-camera.png';
import speechLogo from '../../assets/images/speech.png';
import _ from 'lodash';
//BASE URL
import { BASE_URL } from '../../actions/config';


function AttachmentData(props) {
  const { documentsData } = props;
  const pdfData = _.find(documentsData, { mimeType: 'application/pdf' });
  const imgData = _.find(documentsData, { mimeType: 'image/jpeg' });
  const audioData = _.find(documentsData, { mimeType: 'audio/mpeg' });
  return (
    <React.Fragment>
      {(pdfData || imgData || audioData) && (
        <Card className='request-card-data'>
          <CardBody>
            <CardTitle className='card-data'>
              <div className='d-flex flex-row float-left'>
                <Media
                  className='mr-3'
                  src={attachmentLogo}
                  alt='Attechments'
                  width='50'
                  height='50'
                ></Media>
                <Media heading className='marginTopStyles'>
                  Attachements
                </Media>
              </div>
            </CardTitle>
          </CardBody>
          <Row>
            {pdfData && (
              <Col xl='4' lg={4}>
                <div className='request-attechment-content mx-auto mb-4'>
                  <img src={documentLogo} alt='document' />
                  <a
                    // href={`data:application/pdf;base64,${pdfData.data}`}
                    href={`${BASE_URL}/documents/download/${pdfData.type}/${pdfData.id}`}
                    target={'_blank'}
                    rel='noopener noreferrer'
                  >
                    <h4>document.pdf</h4>
                  </a>
                </div>
              </Col>
            )}
            {imgData && (
              <Col xl='4' lg={4}>
                <div className='request-attechment-content mx-auto mb-4'>
                  <img src={cameraLogo} alt='Camera'></img>
                  <a
                    href={`${BASE_URL}/documents/download/${imgData.type}/${imgData.id}`}
                    target={'_blank'}
                    rel='noopener noreferrer'
                  >
                    <h4>Image.jpg</h4>
                  </a>
                </div>
              </Col>
            )}
            {audioData && (
              <Col xl='4' lg={4}>
                <div className='request-attechment-content mx-auto mb-4'>
                  <img src={speechLogo} alt='Audio'></img>
                  <h4>Mon Audio.wave</h4>
                  <audio controls className="mt-2"><source src={`${BASE_URL}/documents/download/${audioData.type}/${audioData.id}`} type={audioData.mimeType}/></audio>
                </div>
              </Col>
            )}
          </Row>
        </Card>
      )}
    </React.Fragment>
  );
}
AttachmentData.propTypes = {
  documentsData: PropTypes.array.isRequired,
};

export default AttachmentData;
