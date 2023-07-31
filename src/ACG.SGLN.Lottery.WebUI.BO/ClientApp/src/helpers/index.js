import React, { useEffect, useRef } from "react";
import moment from "moment";
import _ from "lodash";
export const requestDateTimeFormat = (date, Format) => {
  let formatedDateTime = new Date(date);
  formatedDateTime = Format
    ? moment(formatedDateTime).format(Format)
    : moment(formatedDateTime).format("YYYY-MM-DDTHH:mm:ss");
  return formatedDateTime;
};

//global function to compare props
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
//global utility to create querystring
export const createJSON = (search) => {
  return JSON.parse(
    '{"' +
      decodeURI(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
};
//global utility to create querystring
export const createQueryString = (objParam) => {
  const queryString = Object.keys(objParam)
    .map((k) => `${encodeURIComponent(k)}=${objParam[k]}`)
    .join("&");
  return queryString;
};
/*function for get ordered(asc) array items*/
export const getOrderedItems = (rawArray, order, conditionName) => {
  if (conditionName) {
    return _.orderBy(rawArray, [conditionName], [order]); // Use Lodash to sort array by 'condition'
  } else {
    return _.orderBy(rawArray, [(item) => item], [order]); // Use Lodash to sort array by 'Label'
  }
};
//global utility to get file extension of base64
export const getFileExtension = (base64String) => {
  const data = base64String.slice(0, 5);
  switch (data.toUpperCase()) {
    case "IVBOR":
      return "data:image/png;base64,";
    case "/9J/4":
      return "data:image/jpeg;base64,";
    case "/9j/2":
      return "data:image/jpg;base64,";
    case "R0lGO":
      return "data:image/gif;base64,";
    case "JVBER":
      return "data:application/pdf;base64,";
    case "Qk06A":
      return "data:image/bmp;base64,";
    default:
      return null;
  }
};
//paasport duration options
export function durationOptions(amount) {
  var options = [];
  for (var i = 0; i < amount; i++) {
    options.push(i + 1);
  }
  return options;
}

export const renderOptions = (
  optionsList,
  label,
  value,
  showFullName,
  cardNumber
) => {
  if (showFullName && label && value) {
    return optionsList.map((option, key) => {
      return (
        <option value={option[value]} key={key}>
          {option[cardNumber]
            ? `${option[label]} ${option[showFullName]} ( ${option[cardNumber]} )`
            : `${option[label]} ${option[showFullName]}`}
        </option>
      );
    });
  } else {
    if (label && value) {
      return optionsList.map((option, key) => {
        return (
          <option value={option[value]} key={key}>
            {option[label]}
          </option>
        );
      });
    } else {
      return optionsList.map((option, key) => {
        return (
          <option value={option} key={key}>
            {option}
          </option>
        );
      });
    }
  }
};

const labelsResourceData = {...JSON.parse(localStorage.getItem("resourceInfo"))};
const userData = localStorage.getItem("loginInfo") ? {...JSON.parse(localStorage.getItem('loginInfo') || {}).userData} : {}

//get request nature types from resource info
export const getRequestNatureTypes = (data) => {
  const resourceData = labelsResourceData ? labelsResourceData : data;
  if (resourceData) {
    return Object.keys(resourceData?.RequestNatureType ||{}).map((statusKey) => {
        return {
          label: resourceData.RequestNatureType[statusKey],
          value: statusKey,
        }
    })
  } else {
    return [];
  }
}
//get reqeust statues from resource info
export const getRequestStatusTypes = (data) => {
  const resourceData = labelsResourceData ? labelsResourceData : data;
  if (resourceData) {
    return Object.keys(resourceData?.RequestStatusType || {}).map((statusKey) => {
        return {
          label: resourceData.RequestStatusType[statusKey],
          value: statusKey,
        }
    })
  } else {
    return [];
  }
}

//get reqeust category from resource info
export const getRequestCategoryTypes = (data) => {
  const resourceData = labelsResourceData ? labelsResourceData : data;
  if (resourceData) {
    return Object.keys(resourceData?.RequestCategoryType || {}).map((statusKey) => {
        return {
          label: resourceData.RequestCategoryType[statusKey],
          value: statusKey,
        }
    })
  } else {
    return [];
  }
}

//get Notification from resource info
export const getNotificationTypes = (data) => {
  const resourceData = labelsResourceData ? labelsResourceData : data;
  if (resourceData) {
    return Object.keys(resourceData?.NotificationType || {}).map((statusKey) => {
        return {
          label: resourceData.NotificationType[statusKey],
          value: statusKey,
        }
    })
  } else {
    return [];
  }
}

//get Roles list
export const getListOfRoles = (data) => {
  const resourceData = labelsResourceData ? labelsResourceData : data;
  let result = []
  if (resourceData) {
    Object.keys(resourceData?.RoleTranslations || {}).forEach((statusKey) => {
      if (["Administrators", "ExternalAgents", "InternalAgents"].includes(statusKey)) {
        result.push({
          label: resourceData.RoleTranslations[statusKey],
          value: statusKey,
        });
      }
    });
    return result;
  } else {
    return result;
  }
}

/*------------to open google maps------------------------*/
export const openGoogleMaps = (data) => {
  const lat =
    (data && data.latitude) || 31.5067205;
  const lng =
    (data && data.longitude) || -7.0116812;
  const zoom = 8;
  window.open(`https://www.google.com/maps/@${lat},${lng},${zoom}z`);
};

export const convertUtcDate = (apiData) => {
  const date = new Date(apiData);
  const value = date.setTime(date.getTime() + (Math.abs(new Date().getTimezoneOffset())*60*1000));
  return new Date(value);
}
export const validateRequest = (properties = {}, data = {}) => {
  for (const key in properties) {
    if(!data[key]){
      throw new Error("Veuillez saisir les champs requis");
    }
  }
}

//function for handle user permissions globally
export const confirmPermissions = (permission) => {
  let permissions = Object.entries(userData).length ? userData.permissions : [];
  const roleName = userData.roleName ? userData.roleName : "";
  if (roleName !=="Administrators" && permissions && permissions.length) {
    return _.uniqBy(permissions).indexOf(permission) >= 0;
  } else {
    return true;
  }
};

export const isAdmin = () => {
  const roleName = userData.roleName;
  return roleName === "Administrators" ? true : false
}

// Extract an Base64 Image's File Extension
export function extractImageFileExtensionFromBase64 (base64Data) {
  if (base64Data) {
    return base64Data.substring('data:image/'.length, base64Data.indexOf(';base64'))
  }
  
}

// Convert a Base64-encoded string to a File object
export function base64StringtoFile (base64String, filename) {
  var arr = base64String.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {type: mime})
}

//get Direction types from resource info
export const getDirectionTypes = (data) => {
  const resourceData = labelsResourceData ? labelsResourceData : data;
  if (resourceData) {
    return Object.keys(resourceData?.ProcessingDirectionType || {}).map((statusKey) => {
        return {
          label: resourceData.ProcessingDirectionType[statusKey],
          value: statusKey,
        }
    })
  } else {
    return [];
  }
}