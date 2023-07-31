import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import Loader from "react-spinners/FadeLoader";

export function GlobalLoader() {
  /*-----nextprops------*/
  const nextProps = useSelector(
    (state) => ({
      isLoading: state.Loader.isLoading,
    }),
    shallowEqual
  );

  return nextProps.isLoading ? (
    <div className="backdrop-loader" id="loader">
      <div className="overlay ">
        <Loader
          color={"#0E48EB"}
          loading={nextProps.isLoading}
          margin={2}
          size={20}
        />
      </div>
    </div>
  ) : null;
}

export default GlobalLoader;
