import { FaUsers } from "react-icons/fa6";
import { CiTimer, CiUser } from "react-icons/ci";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import classes from "./Home.module.css";
import Layout from "../../components/layout/Layout";

import { useCookies } from "react-cookie";
export default function Home({ socket }) {
  const [cookies] = useCookies(["auth"]);
  const navigate = useNavigate();
  const [data, setData] = useState({
    dataUser: [],
    totalUser: 0,
    totalAccessTime: 0,
  });
  useEffect(() => {
    axios
      .get("/admin/get-user/top")
      .then((res) => {
        setData({
          ...res.data,
          totalAccessTime: res.data.totalAccessTime.toFixed(2),
        });
      })
      .catch((err) => {
        navigate("/login");
      });
  }, [socket]);

  return (
    <Layout socket={socket}>
      <div className={classes["dashboard-container"]}>
        <div className={classes["dashboard-header"]}>
          <h2 className={classes["dashboard-header_title"]}>DashBoard</h2>
        </div>
        <div className={classes["container-content"]}>
          <div className={classes["dashboard-header_content"]}>
            <div className={classes["header-item"]}>
              <div className={classes["item-title"]}>
                <p>Quantity user</p>
                <FaUsers />
              </div>
              <h2 className={classes["item-quantity"]}>{data.totalUser}</h2>
            </div>
            <div className={classes["header-item"]}>
              <div className={classes["item-title"]}>
                <p>Total access time</p>
                <CiTimer />
              </div>
              <h2 className={classes["item-quantity"]}>
                {data.totalAccessTime} (hour)
              </h2>
            </div>
            <div className={classes["header-item"]}>
              <div className={classes["item-title"]}>
                <p>New user in month</p>
                <CiUser />
              </div>
              <h2 className={classes["item-quantity"]}>{data.totalUser}</h2>
            </div>
          </div>

          <div className={classes["table-container"]}>
            <h3>Top 5 most visited user</h3>
            <table>
              <thead className={classes["table-header"]}>
                <tr>
                  <td>ID</td>
                  <td>Name</td>
                  <td>Hour</td>
                  <td>Quantity Message</td>
                </tr>
              </thead>
              <tbody>
                {data.dataUser.map((user) => {
                  return (
                    <tr key={user._id} className={classes["table-body_item"]}>
                      <td>{user._id}</td>
                      <td>
                        <div className={classes["item-img"]}>
                          <img width="50px" src={user.avatar} alt="avatar" />
                          <span>{user.userName}</span>
                        </div>
                      </td>
                      <td>{user.totalTime.toFixed(2)}</td>
                      <td>{user.messages}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
