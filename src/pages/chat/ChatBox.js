import React from "react";
import { useCookies } from "react-cookie";
import Layout from "../../components/layout/Layout";
import ListChat from "./element/list-chat/ListChat";
import classes from "./ChatBox.module.css";
export function LayoutChat({ children, reLoadSend }) {
  return (
    <Layout>
      <ListChat reloadSend={reLoadSend} />
      <div className={classes["box-chat"]}>{children}</div>
    </Layout>
  );
}

export default function ChatBox() {
  const [cookies] = useCookies(["auth"]);
  return (
    <LayoutChat>
      <img src={cookies.avatar} alt="avatar" />
      <h3>Hey, {cookies.name}</h3>
      <p>Please select a chat to start messaging.</p>
    </LayoutChat>
  );
}
