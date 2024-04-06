import { useNavigate, useParams } from "react-router-dom";
import classes from "./Item.module.css";
import useGetUser from "../../../../hooks/useGetUser";
import { useCookies } from "react-cookie";
export default function Item({ data }) {
  const navigate = useNavigate();
  const params = useParams();
  const [cookie] = useCookies(["auth"]);
  return (
    <li
      className={
        data.seend || params.id === data._id
          ? classes["chat-item"]
          : `${classes["chat-item"]} ${classes.seened}`
      }
      onClick={() => {
        navigate(`/chat/${data._id}`);
        data.seend = true;
      }}
    >
      <div className={classes["img-container"]}>
        {data.users.length === 1 && (
          <img src={data.users[0].avatar} alt="avartar" />
        )}
        {data.users.length !== 1 && (
          <div className={classes["avatar-group"]}>
            <img
              src={
                data.users[0].avatar === cookie.avatar
                  ? data.users[1].avatar
                  : data.users[0].avatar
              }
              alt="avatar"
            />
            <img
              src={
                data.users[data.users.length - 1].avatar === cookie.avatar
                  ? data.users[data.users.length - 2].avatar
                  : data.users[data.users.length - 1].avatar
              }
              alt="avatar"
            />
          </div>
        )}
        {data.users[0].connecting.status && (
          <div className={classes["online"]}></div>
        )}
        {!data.users[0].connecting.status &&
          data.users[0].connecting?.time?.time && (
            <div className={classes["offline"]}>
              {data.users[0].connecting?.time?.time}{" "}
              {data.users[0].connecting?.time?.unit}
            </div>
          )}
      </div>
      <div className={classes["item-user"]}>
        <h3>{data.users[0].name}</h3>
        <span>
          {data.messages &&
            (data.messages.sender === data.user
              ? `${data.users[0].name}: ${
                  data.messages.type === "image" ? "New Image" : data.messages
                }`
              : `You: ${
                  data.messages.type === "image" ? "New Image" : data.messages
                }`)}
        </span>
      </div>
    </li>
  );
}
