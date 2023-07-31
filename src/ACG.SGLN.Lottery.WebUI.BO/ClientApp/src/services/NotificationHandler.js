import React from "react";
import { toast, Slide } from "react-toastify";
import { GoCheck } from "react-icons/go";
import { AiOutlineInfoCircle } from "react-icons/ai";

/*-------function that handle all type of error and success notifications----*/
export function GlobalNotificationHandle(status, message) {
  let content;
  if (status >= 200 && status < 300) {
    if (message) {
      toast.success(
        <>
          <span className="toast-icon success">
            <GoCheck size={20} />
          </span>{" "}
          <span className="toast-text">{message}</span>
        </>,
        {
          position: "top-right",
          autoClose: 5000,
          transition: Slide,
        }
      );
    }
  } else {
    if (status >= 400 && status < 600 && status !== 401) {
      content = message;
    } else if (status === 401) {
      localStorage.removeItem("loginInfo");
      window.location = "login";
    //   window.location = LOGIN_API;
     
    }
    if (content) {
      toast.error(
        <>
          <span className="toast-icon">
            <AiOutlineInfoCircle size={20} />
          </span>{" "}
          <span className="toast-text">{content}</span>
        </>,
        {
          position: "top-right",
          autoClose: 5000,
          transition: Slide,
        }
      );
    }
  }
}
