import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";

import classes from "./Users.module.css";

import Layout from "../../components/layout/Layout";
import Alerts from "../../portal/alert/Alert";

export default function Users() {
  const alertDefault = {
    status: false,
    severity: "",
    msg: "",
    actionHandler: () => {},
  };
  const [alert, setAlert] = useState(alertDefault);
  const [dataTable, setDataTable] = useState({ totalPage: 2, dataUser: [] });
  const [pageNum, setPageNum] = useState(1);
  function closeAlert() {
    setAlert(alertDefault);
  }

  // next table and back table
  const nextPage = () => {
    if (pageNum < dataTable.totalPage) {
      setPageNum((pageNum) => pageNum + 1);
    }
  };
  const backPage = () => {
    if (pageNum > 1) {
      setPageNum((pageNum) => pageNum - 1);
    }
  };
  useEffect(() => {
    axios
      .get(`/admin/get-user/user?page=${pageNum}`)
      .then((res) => {
        setDataTable(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageNum]);
  //set admin and set user handler
  const setAdminAction = (_id) => {
    setAlert(alertDefault);
    axios
      .post("/admin/set-admin", { _id: _id })
      .then((res) => {
        const indexUser = dataTable.dataUser.findIndex(
          (user) => user._id === _id
        );

        dataTable.dataUser[indexUser].role =
          dataTable.dataUser[indexUser].role === "admin" ? "user" : "admin";
        setDataTable({ ...dataTable, dataUser: dataTable.dataUser });
        setAlert({
          status: true,
          severity: "success",
          msg: res.data.msg,
          actionHandler: () => {},
        });
      })
      .catch((err) => {
        setAlert({
          status: true,
          severity: "error",
          msg: err?.response?.data?.msg,
          actionHandler: () => {},
        });
      });
  };
  const setAdmin = (msg, _id) => {
    setAlert({
      status: true,
      severity: "info",
      msg: msg,
      actionHandler: () => setAdminAction(_id),
    });
  };
  // ban and unban user handler
  const setBanAction = (_id) => {
    setAlert(alertDefault);
    axios
      .post("/admin/ban-user", { _id: _id })
      .then((res) => {
        const indexUser = dataTable.dataUser.findIndex(
          (user) => user._id === _id
        );

        dataTable.dataUser[indexUser].baned =
          !dataTable.dataUser[indexUser].baned;

        setDataTable({ ...dataTable, dataUser: dataTable.dataUser });
        setAlert({
          status: true,
          severity: "success",
          msg: res.data.msg,
          actionHandler: () => {},
        });
      })
      .catch((err) => {
        setAlert({
          status: true,
          severity: "error",
          msg: "Something is wrong!",
          actionHandler: () => {},
        });
      });
  };
  const setBan = (msg, _id) => {
    setAlert({
      status: true,
      severity: "info",
      msg: msg,
      actionHandler: () => setBanAction(_id),
    });
  };
  // delete user
  const deleteUserAction = (_id) => {
    setAlert(alertDefault);
    axios
      .delete(`/admin/delete-user/${_id}`)
      .then((res) => {
        const dataUser = dataTable.dataUser.filter((user) => user._id !== _id);

        setDataTable({ ...dataTable, dataUser: dataUser });
        setAlert({
          status: true,
          severity: "success",
          msg: res.data.msg,
          actionHandler: () => {},
        });
      })
      .catch((err) => {
        setAlert({
          status: true,
          severity: "error",
          msg: "Something is wrong!",
          actionHandler: () => {},
        });
      });
  };
  const deleteUser = (msg, _id) => {
    setAlert({
      status: true,
      severity: "info",
      msg: msg,
      actionHandler: () => deleteUserAction(_id),
    });
  };
  return (
    <Layout>
      <div className={classes["user-container"]}>
        {alert.status && (
          <Alerts
            severity={alert.severity}
            close={closeAlert}
            msg={alert.msg}
            actionHandler={alert.actionHandler}
          />
        )}
        <div className={classes["table-container"]}>
          <div className={classes["table-title"]}>
            <h3>List user</h3>
            <button>
              <FaPlus /> Create new user
            </button>
          </div>
          <table>
            <thead className={classes["table-header"]}>
              <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Hour</td>
                <td>Set admin</td>
                <td>Ban user</td>
                <td>Delete user</td>
              </tr>
            </thead>
            <tbody>
              {dataTable.dataUser.map((user) => {
                return (
                  <tr key={user._id} className={classes["table-body_item"]}>
                    <td>65e8b7f2dddab1fab3e1275d</td>
                    <td>
                      <div className={classes["item-img"]}>
                        <img width="50px" src={user.avatar} />
                        <span>{user.userName}</span>
                      </div>
                    </td>
                    <td>{user.totalTime}</td>
                    <td>
                      <button
                        className={`${classes.btn} ${
                          user.role === "admin"
                            ? classes["btn-admin"]
                            : classes["btn-user"]
                        }`}
                        onClick={() =>
                          setAdmin(
                            user.role !== "admin"
                              ? "Do you want set admin for user?"
                              : "Do you want to cancel the administrator rights to the user?",
                            user._id
                          )
                        }
                      >
                        {user.role}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setBan(
                            user.baned
                              ? "Do you want unBan user?"
                              : "Do you want ban user?",
                            user._id
                          );
                        }}
                        className={`${classes.btn} ${
                          user.baned ? classes["btn-unban"] : classes["btn-ban"]
                        }`}
                      >
                        {user.baned ? "UnBan" : "Ban"}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          deleteUser(
                            `Do you want delete user ${user.userName}`,
                            user._id
                          )
                        }
                        className={`${classes.btn} ${classes["btn-delete"]}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={classes["next-page"]}>
          <button onClick={backPage}>
            <IoIosArrowBack />
          </button>
          <p>
            {pageNum}/{dataTable.totalPage}
          </p>
          <button onClick={nextPage}>
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </Layout>
  );
}
