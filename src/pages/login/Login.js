import { useRef } from "react";
import classes from "./Login.module.css";

import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { display } from "../../redux/showAlertSlice";

export default function Login() {
  const [cookies, setCookies] = useCookies(["auth"]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userNameRef = useRef();
  const passwordRef = useRef();
  const notify = (msg) => {
    dispatch(
      display({
        severity: "error",
        message: msg,
        close: { title: "close" },
      })
    );
  };

  const validate = (userName, password) => {
    if (!userName) {
      notify("UserName is empty");

      return false;
    }
    if (!password) {
      notify("Password is empty");
      return false;
    }
    if (password.length < 8) {
      notify("Password is wrong!");
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
          notify(err.response.data.msg);
        });
    }
  };
  return (
    <div className={classes["login-container"]}>
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
        <span
          onClick={() => navigate("/forgot-password")}
          className={classes["fotgot"]}
        >
          Forgot Password
        </span>
      </form>
    </div>
  );
}
