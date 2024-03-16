import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

import axios from "axios";

import classes from "./Sidebar.module.css";

import { CiLogout, CiChat1 } from "react-icons/ci";
import { RxDashboard } from "react-icons/rx";
import { FaRegUser } from "react-icons/fa";
import { LuChevronRight } from "react-icons/lu";

import { socketContext } from "../../App";
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, message } = useContext(socketContext);
  const [, , removeCookie] = useCookies(["auth"]);
  const [totalMessage, setTotalMessage] = useState(0);
  const logoutHandler = () => {
    socket.disconnect();
    removeCookie("auth");
    removeCookie("userName");
    navigate("/login");
  };

  useEffect(() => {
    axios
      .get("/admin/total-chat")
      .then((res) => {
        const pathname = location.pathname.slice(5, 100);
        const data = res.data.filter((user) => {
          return !location.pathname.includes(user._id);
        });
        setTotalMessage(data.length);
      })
      .catch(() => {
        setTotalMessage(0);
      });
  }, [message, location.pathname]);
  return (
    <div className={classes["sidebar-container"]}>
      <div className={classes["sidebar-title"]}>
        <h2>Admin</h2>
        <img
          width="40px"
          alt="avatar"
          src="https://www.w3schools.com/howto/img_avatar.png"
        />
      </div>
      <div className={classes["sidebar-content"]}>
        <div
          onClick={() => navigate("/")}
          className={classes["sidebar-content_item"]}
        >
          {location.pathname === "/" && <LuChevronRight />}

          <RxDashboard />
          <span>Dashboard</span>
        </div>
        <div
          onClick={() => navigate("/users")}
          className={classes["sidebar-content_item"]}
        >
          {location.pathname === "/users" && <LuChevronRight />}

          <FaRegUser />
          <span>Users</span>
        </div>
        <div
          onClick={() => navigate("/chat")}
          className={classes["sidebar-content_item_chat"]}
        >
          {location.pathname.includes("/chat") && <LuChevronRight />}
          <div className={classes["item-chat"]}>
            <CiChat1 />
            {totalMessage !== 0 && <span>{totalMessage}</span>}
          </div>
          <span>Chat</span>
        </div>
      </div>
      <div className={classes["sidebar-content_item"]} onClick={logoutHandler}>
        <CiLogout />
        <span>Logout</span>
      </div>
    </div>
  );
}
