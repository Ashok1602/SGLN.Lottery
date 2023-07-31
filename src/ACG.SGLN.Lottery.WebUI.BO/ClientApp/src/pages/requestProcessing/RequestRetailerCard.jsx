import React from "react";
import { Card, CardBody, CardTitle, Label, FormGroup, Media } from "reactstrap";
import PropTypes from "prop-types";
import retailerLogo from "../../assets/images/retailer-logo.png";
import { TRANSLATE } from "../../constants";
function RequestRetailerCard(props) {
  const { retailer } = props;
  return (
    <React.Fragment>
      <Card className="request-card-data" style={{ height: "597px" }}>
        <CardBody>
          <CardTitle>
            <div className="d-flex mb-3">
              <Media
                className="mr-3"
                src={retailerLogo}
                alt="Retailer logo"
              ></Media>
              <Media heading className="marginTopStyles">
                {TRANSLATE.t("REQUESTS.RETAILER_DATA")}
              </Media>
            </div>
          </CardTitle>
          <form>
            <FormGroup>
              <Label>{TRANSLATE.t("REQUESTS.LAST_NAME")}</Label>
              <div className="p-2 field-style">{retailer.lastName || "NA"}</div>
            </FormGroup>
            <FormGroup>
              <Label>{TRANSLATE.t("REQUESTS.FIRST_NAME")}</Label>
              <div className="p-2 field-style">
                {retailer.firstName || "NA"}
              </div>
            </FormGroup>
            <FormGroup>
              <Label>{TRANSLATE.t("REQUESTS.BORN")}</Label>
              <div className="p-2 field-style">
                {retailer.birthDate || "NA"}
              </div>
            </FormGroup>
            <FormGroup>
              <Label>N CIN</Label>
              <div className="p-2 field-style">{retailer.address || "NA"}</div>
            </FormGroup>
            <FormGroup>
              <Label>{TRANSLATE.t("REQUESTS.LOCAL")}</Label>
              <div className="p-2 field-style">
                {retailer.addressLine2 || "NA"}
              </div>
            </FormGroup>
            <FormGroup>
              <Label>{TRANSLATE.t("REQUESTS.CITY")}</Label>
              <div className="p-2 field-style">{retailer.city || "NA"}</div>
            </FormGroup>
          </form>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
RequestRetailerCard.propTypes = {
  retailer: PropTypes.object.isRequired,
};

export default RequestRetailerCard;
