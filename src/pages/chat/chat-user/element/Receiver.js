import MessageItem from "./messageItem/MessageItem";
export default function Receiver({ msg }) {
  return (
    <MessageItem
      msg={msg}
      container={"receicer-container"}
      tittle={"receiver"}
    />
  );
}
