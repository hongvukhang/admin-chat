import { useNavigate, useParams } from "react-router-dom";
import classes from "./Item.module.css";
import useGetUser from "../../../../hooks/useGetUser";
export default function Item({ data }) {
  const navigate = useNavigate();
  const params = useParams();
  const user = useGetUser(data);
  return (
    <li
      className={
        data.seened || params.id === data._id
          ? classes["chat-item"]
          : `${classes["chat-item"]} ${classes.seened}`
      }
      onClick={() => {
        navigate(`/chat/${data._id}`);
        data.seened = true;
      }}
    >
      <div className={classes["img-container"]}>
        <img src={user.avatar} alt="avartar" />
        {user.connecting.status && <div className={classes["online"]}></div>}
        {!user.connecting.status && user.connecting?.time?.time && (
          <div className={classes["offline"]}>
            {user.connecting?.time?.time} {user.connecting?.time?.unit}
          </div>
        )}
      </div>
      <div className={classes["item-user"]}>
        <h3>{user.userName}</h3>
        <span>
          {user.msg &&
            (user.msg.sender === data.user
              ? `${user.userName}: ${
                  user.msg.type === "image" ? "New Image" : user.msg.message
                }`
              : `You: ${
                  user.msg.type === "image" ? "New Image" : user.msg.message
                }`)}
        </span>
      </div>
    </li>
  );
}
