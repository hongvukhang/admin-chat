import React from "react";
import classes from "./layout.module.css";
import Sidebar from "../sidebar/Sidebar";
export default function Layout({ children }) {
  return (
    <div className={classes.container}>
      <Sidebar />
      {children}
    </div>
  );
}
