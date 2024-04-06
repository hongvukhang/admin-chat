import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import classes from "./ForgotPasswordBackup.module.css";
import { useDispatch } from "react-redux";
import { display } from "../../redux/showAlertSlice";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [changePassword, setChangePassword] = useState(false);

  const [email, setEmail] = useState("exam@gmail.com");

  const userNameRef = useRef();
  const passwordRef = useRef();
  const passwordComfirmRef = useRef();
  const otpRef = useRef();

  //format email
  const formatEmail = (email) => {
    const a = email.split("@");
    let newEmail = "";
    for (let i = 0; i < a[0].length; i++) {
      if (i === 0 || i === a[0].length - 1) {
        newEmail += a[0][i];
        continue;
      }
      newEmail += "*";
    }
    return (newEmail + "@").concat(a[1]);
  };
  //submit username
  const submitUserNameHandler = (e) => {
    e.preventDefault();
    const userName = userNameRef.current.value;
    if (!userName) {
      dispatch(
        display({
          message: "UserName is empty!",
          severity: "error",
          close: { title: "close" },
        })
      );
      return;
    }

    axios
      .post("/email/send-otp-forgot-password-admin", { userName: userName })
      .then((res) => {
        setEmail(res.data.info.accepted[0]);
        setChangePassword(true);
      })
      .catch((err) => {
        dispatch(
          display({
            message: err?.response?.data?.msg,
            severity: "error",
            close: { title: "close" },
          })
        );
      });
  };
  const validatePassword = (password, comfirmPassword, otp) => {
    if (!password) {
      dispatch(
        display({
          severity: "error",
          message: "Password is empty!",
          close: { title: "close" },
        })
      );
      return false;
    }
    if (!comfirmPassword) {
      dispatch(
        display({
          severity: "error",
          message: "Comfirm password is empty!",
          close: { title: "close" },
        })
      );
      return false;
    }
    if (!otp) {
      dispatch(
        display({
          severity: "error",
          message: "OTP is empty!",
          close: { title: "close" },
        })
      );

      return false;
    }
    if (comfirmPassword !== password) {
      dispatch(
        display({
          severity: "error",
          message: "Confirm password and password are not the same",
          close: { title: "close" },
        })
      );

      return false;
    }
    if (password.length < 8) {
      dispatch(
        display({
          severity: "error",
          message: "Password length is less than eight",
          close: { title: "close" },
        })
      );

      return false;
    }
    return true;
  };
  const submitPasswordHandler = (e) => {
    e.preventDefault();
    const password = passwordRef.current.value;
    const passwordComfirm = passwordComfirmRef.current.value;
    const otp = otpRef.current.value;
    const val = validatePassword(password, passwordComfirm, otp);
    if (!val) return;
    axios
      .post("/new-password", {
        password: password,
        passwordComfirm: passwordComfirm,
        otp: otp,
        email: email,
      })
      .then((res) => {
        dispatch(
          display({
            severity: "success",
            message: res.data.msg,
            close: { title: "navigate", payload: "/login" },
          })
        );
      })
      .catch((err) => {
        dispatch(
          display({
            severity: "error",
            message: err?.response?.data?.msg,
            close: { title: "close" },
          })
        );
      });
  };
  return (
    <div className={classes.container}>
      <main className={classes.content}>
        {changePassword && (
          <IoIosArrowBack onClick={() => setChangePassword(false)} />
        )}
        {!changePassword && (
          <IoIosArrowBack
            onClick={() => {
              navigate("/login");
            }}
          />
        )}
        <h2 className={classes.title}>Forgot Password</h2>
        {!changePassword && (
          <form
            onSubmit={submitUserNameHandler}
            className={classes["form-username"]}
          >
            <p>User Name:</p>
            <input type="text" placeholder="User Name" ref={userNameRef} />
            <button className={classes.btn}>Submit</button>
          </form>
        )}
        {changePassword && (
          <form
            className={classes["form-username"]}
            onSubmit={submitPasswordHandler}
          >
            <p>Password:</p>
            <input
              type="password"
              placeholder="Password"
              required
              ref={passwordRef}
            />
            <p>Comfirm password:</p>
            <input
              type="password"
              placeholder="Comfirm password"
              required
              ref={passwordComfirmRef}
            />
            <p>OTP: (Please check your email: {formatEmail(email)})</p>
            <input type="text" placeholder="OTP" required ref={otpRef} />
            <button className={classes.btn}>Submit</button>
          </form>
        )}
      </main>
    </div>
  );
}
