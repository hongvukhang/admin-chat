import MessageItem from "./messageItem/MessageItem";
export default function Receiver({ msg }) {
  return (
    <MessageItem msg={msg} container={"sender-container"} tittle={"sender"} />
  );
}
