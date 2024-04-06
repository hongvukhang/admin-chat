import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";

import classes from "./Users.module.css";

import Layout from "../../components/layout/Layout";
import Alerts from "../../portal/alert/Alert";
import Search from "./search/Search";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { display } from "../../redux/showAlertSlice";

export default function Users() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [dataTable, setDataTable] = useState({ totalPage: 2, dataUser: [] });
  const [dataFilter, setDatafilter] = useState(dataTable);
  const [search, setSearch] = useState("");
  const [pageNum, setPageNum] = useState(1);

  const dispatch = useDispatch();

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
        setDatafilter(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageNum]);

  const filterData = (dataUser) => {
    const data = dataUser.filter((user) =>
      user.userName.toLowerCase().includes(search.toLowerCase())
    );
    return data;
  };

  useEffect(() => {
    if (filter == "all") {
      if (search !== "") {
        const data = filterData(dataTable.dataUser);
        setDatafilter({ ...dataTable, dataUser: data });
        return;
      }
      setDatafilter(dataTable);
      return;
    }
    if (filter === "user" || filter === "admin") {
      const dataFilter = dataTable.dataUser.filter(
        (user) => user.role === filter
      );
      if (search !== "") {
        const data = filterData(dataFilter);
        const totalPage = Math.ceil(data.length / 6);
        setDatafilter({ totalPage: totalPage, dataUser: data });
        return;
      }
      const totalPage = Math.ceil(dataFilter.length / 6);
      setDatafilter({ totalPage: totalPage, dataUser: dataFilter });
      return;
    }
    if (filter === "baned") {
      const dataFilter = dataTable.dataUser.filter((user) => user.baned);
      if (search !== "") {
        const data = filterData(dataFilter);
        const totalPage = Math.ceil(data.length / 6);
        setDatafilter({ totalPage: totalPage, dataUser: data });
        return;
      }
      const totalPage = Math.ceil(dataFilter.length / 6);
      setDatafilter({ totalPage: totalPage, dataUser: dataFilter });
      return;
    }
  }, [filter, search]);

  // show alert handler

  const alertHandler = (severity, message, action) => {
    dispatch(
      display({
        severity: severity,
        message: message,
        action: action,
        close: { title: "close" },
      })
    );
  };

  //set admin and set user handler
  const setAdminAction = (_id) => {
    axios
      .post("/admin/set-admin", { _id: _id })
      .then((res) => {
        const indexUser = dataTable.dataUser.findIndex(
          (user) => user._id === _id
        );

        dataTable.dataUser[indexUser].role =
          dataTable.dataUser[indexUser].role === "admin" ? "user" : "admin";
        setDataTable({ ...dataTable, dataUser: dataTable.dataUser });
        alertHandler("success", res.data.msg);
      })
      .catch((err) => {
        alertHandler("error", err?.response?.data?.msg);
      });
  };
  const setAdmin = (msg, _id) => {
    alertHandler("info", msg, () => setAdminAction(_id));
  };
  // ban and unban user handler
  const setBanAction = (_id) => {
    axios
      .post("/admin/ban-user", { _id: _id })
      .then((res) => {
        const indexUser = dataTable.dataUser.findIndex(
          (user) => user._id === _id
        );

        dataTable.dataUser[indexUser].baned =
          !dataTable.dataUser[indexUser].baned;

        setDataTable({ ...dataTable, dataUser: dataTable.dataUser });
        dispatch(
          display({
            severity: "success",
            message: res.data.msg,
            close: { title: "close" },
          })
        );
      })
      .catch((err) => {
        alertHandler("error", err?.response?.data?.msg);
      });
  };
  const setBan = (msg, _id) => {
    dispatch(
      display({
        severity: "info",
        message: msg,
        action: () => setBanAction(_id),
        close: { title: "close" },
      })
    );
  };
  // delete user
  const deleteUserAction = (_id) => {
    axios
      .delete(`/admin/delete-user/${_id}`)
      .then((res) => {
        const dataUser = dataTable.dataUser.filter((user) => user._id !== _id);
        const dataUserFilter = dataFilter.dataUser.filter(
          (user) => user._id !== _id
        );
        setDataTable({ ...dataTable, dataUser: dataUser });
        setDatafilter({ ...dataFilter, dataUser: dataUserFilter });
        dispatch(
          display({
            severity: "success",
            message: res.data.msg,
            close: { title: "close" },
          })
        );
      })
      .catch((err) => {
        alertHandler("error", err?.response?.data?.msg);
      });
  };
  const deleteUser = (msg, _id) => {
    dispatch(
      display({
        severity: "info",
        message: msg,
        action: () => deleteUserAction(_id),
        close: { title: "close" },
      })
    );
  };

  //
  const searchHandler = (userName) => {
    setSearch(userName);
  };

  const sendMessage = (Id) => {
    axios
      .get(`/chat/send-message/${Id}`)
      .then((res) => {
        navigate(`/chat/${res.data}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Layout>
      <div className={classes["user-container"]}>
        <div className={classes["table-container"]}>
          <div className={classes["table-title"]}>
            <h3>List user</h3>
            <Search search={searchHandler} />
            <select
              className={classes["select-filter"]}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="baned">Baned</option>
            </select>
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
              {dataFilter.dataUser.map((user) => {
                return (
                  <tr key={user._id} className={classes["table-body_item"]}>
                    <td onClick={() => sendMessage(user._id)}>{user._id}</td>
                    <td>
                      <div className={classes["item-img"]}>
                        <img width="50px" src={user.avatar} />
                        <span>{user.userName}</span>
                      </div>
                    </td>
                    <td>{user.totalTime.toFixed(2)}</td>
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
            {pageNum}/{dataFilter.totalPage}
          </p>
          <button onClick={nextPage}>
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </Layout>
  );
}
