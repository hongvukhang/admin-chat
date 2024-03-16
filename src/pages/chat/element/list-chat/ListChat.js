import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "./ListChat.module.css";
import Item from "../items/Item";
import { socketContext } from "../../../../App";
export default function ListChat({ reloadSend, className }) {
  const { socket, message } = useContext(socketContext);
  const [msgs, setMsgs] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/chat-list")
      .then((res) => {
        setMsgs(res.data);
      })
      .catch((err) => {
        navigate("/login");
      });
  }, [message, reloadSend]);
  return (
    <main className={`${classes["list-chat_container"]} ${classes[className]}`}>
      <h1>Messages</h1>
      <ul className={classes["list-chat"]}>
        {msgs.map((li) => {
          return <Item key={li._id} data={li} />;
        })}
      </ul>
    </main>
  );
}
