import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";

import axios from "axios";

import { io } from "socket.io-client";

import Home from "./pages/home/Home";
import Users from "./pages/users/Users";
import Login from "./pages/login/Login";
import ChatUser from "./pages/chat/chat-user/ChatUser.js";
import ChatBox from "./pages/chat/ChatBox.js";

export const socketContext = React.createContext();
function App() {
  const [cookies] = useCookies(["auth"]);
  axios.defaults.baseURL = "http://localhost:5000/";
  axios.defaults.headers.common["Authorization"] = `Bearer ${cookies.auth}`;

  const [socketIO, setSocketIO] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    if (cookies.userName) {
      const socket = io("http://localhost:5000", {
        query: {
          id: cookies.userName,
        },
      });
      setSocketIO(socket);
      socket.on("message", (arg) => {
        setMessage(arg);
      });
      socket.on("msg-image", (arg) => {
        setMessage(arg);
      });
      socket.on("disconnectThatSoc", function () {
        socket.disconnect();
      });
    }
  }, [cookies]);
  return (
    <socketContext.Provider value={{ socket: socketIO, message: message }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatBox />} />
        <Route path="/chat/:id" element={<ChatUser />} />
      </Routes>
    </socketContext.Provider>
  );
}

export default App;
