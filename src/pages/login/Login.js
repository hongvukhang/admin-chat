import { useRef, useState } from "react";
import classes from "./Login.module.css";
import Alerts from "../../portal/alert/Alert";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [cookies, setCookies] = useCookies(["auth"]);

  const navigate = useNavigate();

  const [error, setError] = useState({ status: false, msg: "" });
  const userNameRef = useRef();
  const passwordRef = useRef();
  const setNotificaltion = (message) => {
    setError({ status: true, msg: message });
  };
  const validate = (userName, password) => {
    if (!userName) {
      setNotificaltion("UserName is empty");
      return false;
    }
    if (!password) {
      setNotificaltion("Password is empty");
      return false;
    }
    if (password.length < 8) {
      setNotificaltion("Password is wrong!");
      return false;
    }
    return true;
  };
  const loginHandler = (e) => {
    e.preventDefault();
    const userName = userNameRef.current.value;
    const password = passwordRef.current.value;
    const isVal = validate(userName, password);
    if (isVal) {
      axios
        .post("/admin/login", { userName: userName, password: password })
        .then((response) => {
          setCookies("auth", response.data.token);
          setCookies("avatar", response.data.avatar);
          setCookies("userName", response.data.userName);
        })
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          setNotificaltion(err.response.data.msg);
        });
    }
  };
  return (
    <div className={classes["login-container"]}>
      {error.status && (
        <Alerts
          severity="error"
          msg={error.msg}
          close={() => setError({ ...error, status: false })}
        />
      )}
      <form onSubmit={loginHandler} className={classes["login-main"]}>
        <h2>Login Admin</h2>
        <p>User Name:</p>
        <input ref={userNameRef} type="text" placeholder="Enter User Name" />
        <p>Password:</p>
        <input
          ref={passwordRef}
          type="password"
          placeholder="Enter User Name"
        />
        <button className={classes["btn"]}>SIGN IN</button>
      </form>
    </div>
  );
}
