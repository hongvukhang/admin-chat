import React from "react";
import ReactDOM from "react-dom";
import classes from "./Loading.module.css";
export default function Loading() {
  return ReactDOM.createPortal(
    <div className={classes.container}>
      <div className={classes.loading}></div>
    </div>,
    document.querySelector("body")
  );
}
