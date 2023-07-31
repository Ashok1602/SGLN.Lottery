import React from "react";
import { DropzoneArea } from "material-ui-dropzone";
import PropTypes from "prop-types";
import { ACCEPTED_FILES, MAX_FILE_SIZE, TRANSLATE } from "../../constants";
function Dropzone(props) {
  return (
    <div>
      <DropzoneArea
        onChange={props.handleChange}
        onDelete={() => props.toggle()}
        showAlerts={false}
        showFileNames={true}
        showPreviewsInDropzone={props.showPreviewsInDropzone || false}
        showPreviews={props.showPreviews || false}
        showFileNamesInPreview={true}
        dropzoneText={TRANSLATE.t("FILE_UPLOAD_MESSAGE")}
        acceptedFiles={props.acceptedFiles || ACCEPTED_FILES}
        filesLimit={props.filesLimit ? props.filesLimit : 10}
        maxFileSize={MAX_FILE_SIZE}
        previewText={props.preViewText}
      />
    </div>
  );
}
Dropzone.propTypes = {
  handleChange: PropTypes.func.isRequired,
  isShowPreview: PropTypes.bool.isRequired,
  filesLimit: PropTypes.number.isRequired,
  toggle: PropTypes.func.isRequired,
  showPreviewsInDropzone: PropTypes.bool,
  showPreviews: PropTypes.bool,
  acceptedFiles: PropTypes.array,
  preViewText: PropTypes.string
};

export default Dropzone;
