import React from "react";
import ReactDOM from "react-dom";
import classes from "./Alert.module.css";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notDisplay } from "../../redux/showAlertSlice";

export default function Alerts({ severity, msg, close, actionHandler }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeHandler = () => {
    dispatch(notDisplay());
    close.title !== "close" && navigate(close.payload);
  };

  const statuss = {
    success: (
      <Button color="inherit" size="small" onClick={closeHandler}>
        CLOSE
      </Button>
    ),
    error: (
      <Button color="inherit" size="small" onClick={closeHandler}>
        CLOSE
      </Button>
    ),
    info: (
      <>
        <Button color="inherit" size="small" onClick={closeHandler}>
          CANCEL
        </Button>
        <Button
          color="inherit"
          size="small"
          onClick={() => {
            closeHandler();
            actionHandler();
          }}
        >
          OK
        </Button>
      </>
    ),
  };
  const status = {
    success: (
      <Alert
        severity="success"
        action={
          <Button color="inherit" size="small">
            UNDO
          </Button>
        }
      >
        This Alert uses a Button component for its action.
      </Alert>
    ),
    error: (
      <Alert variant="filled" severity="error" onClose={() => {}}>
        This is an outlined error Alert.
      </Alert>
    ),
    action: (
      <Alert
        variant="filled"
        severity="info"
        action={
          <>
            <Button color="inherit" size="small">
              CANCEL
            </Button>
            <Button color="inherit" size="small">
              OK
            </Button>
          </>
        }
        onClose={() => {}}
      >
        This is an outlined info Alert.
      </Alert>
    ),
  };

  return ReactDOM.createPortal(
    <div className={classes["alert-container"]}>
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert severity={severity} variant="filled" action={statuss[severity]}>
          {msg}
        </Alert>
      </Stack>
    </div>,
    document.querySelector("body")
  );
}
