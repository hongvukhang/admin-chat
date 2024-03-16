import React from "react";
import classes from "./ShowImage.module.css";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { notDisplay } from "../../../../../redux/showImageSlice";
export default function ShowImage() {
  const img = useSelector((state) => state.show_image);
  const dispatch = useDispatch();
  return (
    <div className={classes["container-show_image"]}>
      <button
        onClick={() => {
          dispatch(notDisplay());
        }}
        className={classes["btn-close"]}
      >
        <IoMdClose />
      </button>
      <div className={classes["image"]}>
        <img alt="image" src={img.url} />
      </div>
    </div>
  );
}
