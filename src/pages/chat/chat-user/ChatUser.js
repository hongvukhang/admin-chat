import { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { MdOutlineEmojiEmotions } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { MdSend } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";

import Sender from "./element/Sender";
import { LayoutChat } from "../ChatBox";
import Loading from "./element/Loading";
import Receiver from "./element/Receiver";
import classes from "./ChatUser.module.css";

import { socketContext } from "../../../App";
export default function ChatUser() {
  const { socket, message } = useContext(socketContext);

  const params = useParams();
  const navigate = useNavigate();
  const [receiver, setReceiver] = useState({
    userName: "Default",
    _id: null,
    avatar: window.location.origin + "/images/avatar.png",
  });
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [msgImages, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reloading, setReloading] = useState({ msg: "reloading" });
  const msgRef = useRef();

  useEffect(() => {
    msgRef.current.value = "";
  }, [params]);

  const scrollBottom = useRef();

  //function load messages
  const loadMessages = () => {
    axios
      .get(`/chat/${params.id}`)
      .then((res) => {
        setReceiver({
          avatar: res.data.avatar,
          userName: res.data.userName,
          _id: res.data.receiver,
        });

        setMsgs(res.data.messages);
      })
      .catch(() => {
        navigate("/login");
      });
  };

  // function is url
  function isURL(str) {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  }
  // use effect reload message
  useEffect(() => {
    if (message?.msg !== "reloading") {
      setImages(() => []);
      setTimeout(() => {
        loadMessages();
      }, 1000);
    } else {
      loadMessages();
    }
  }, [message, params]);
  //emit message
  const send_message = () => {
    const msg = msgRef.current.value;
    const isURLValue = isURL(msg);

    msg &&
      socket.emit("msg", {
        idChat: params.id,
        receiver_id: receiver._id,
        msg: msg,
        type: isURLValue ? "url" : "text",
      });

    msgRef.current.value = "";
    const loadMessages = [
      ...msgs,
      {
        _id: Math.random(),
        type: isURLValue ? "url" : "text",
        message: msg,
        createAt: new Date(),
      },
    ];
    setMsgs(loadMessages);
    setReloading({ msg: "reloading" });
  };
  //send images
  const sendImages = () => {
    msgImages.forEach((img) => {
      socket.emit(
        "msgImage",
        img,
        {
          idChat: params.id,
          receiver_id: receiver._id,
          originalname: img.name,
          mimetype: img.type,
        },
        (callback) => {
          console.log(callback);
        }
      );
    });

    setImages([]);
    setIsLoading(true);
    setReloading({ msg: "reloading-img" });
    setTimeout(() => {
      loadMessages();
      setIsLoading(false);
    }, 1500);
  };
  //scroll to bottom message
  const scrollToBottom = () => {
    scrollBottom.current.scrollIntoView();
  };
  useEffect(() => {
    scrollToBottom();
  });
  return (
    <LayoutChat reLoadSend={reloading}>
      <main className={classes["container-chatbox"]}>
        <div className={classes["user-detail"]}>
          <div>
            <img src={receiver.avatar} />
            <h3 className={classes["user-name"]}>{receiver.userName}</h3>
          </div>
          <div></div>
        </div>
        <ul className={classes["message-container"]}>
          {msgs.map((msg) => {
            if (msg.sender === receiver._id) {
              return <Receiver key={msg._id} msg={msg} />;
            } else {
              return <Sender key={msg._id} msg={msg} />;
            }
          })}
          {isLoading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Loading />
            </div>
          )}

          <div ref={scrollBottom} />
        </ul>

        {isShowEmoji && (
          <main className={classes["pick-emoji"]}>
            <Picker
              data={data}
              onEmojiSelect={(e) => {
                msgRef.current.value = msgRef.current.value + e.native;
              }}
            />
          </main>
        )}
        {msgImages?.length !== 0 && (
          <div className={classes["show-image"]}>
            <div>
              <IoIosCloseCircle
                onClick={() => {
                  setImages([]);
                }}
              />
              {msgImages.map((img) => (
                <span key={img.lastModifiedDate}>{" " + img.name + " "}</span>
              ))}
            </div>
            <button onClick={sendImages} className={classes["btn-send_images"]}>
              <MdSend />
            </button>
          </div>
        )}
        <div className={classes["input-message"]}>
          <textarea
            ref={msgRef}
            aria-valuetext={msgRef.current?.value ? msgRef.current.value : " "}
            placeholder="Message..."
          />
          <input
            style={{ display: "none" }}
            type="file"
            id="image"
            name="image"
            multiple
            onChange={(e) => {
              setImages([...e.target.files]);
            }}
          />
          <label className={classes["send-images"]} htmlFor="image">
            <FaImage />
          </label>

          <button
            onClick={() => {
              setIsShowEmoji((is) => !is);
            }}
            className={classes["btn-emoji"]}
          >
            <MdOutlineEmojiEmotions />
          </button>
          <button
            onClick={send_message}
            className={classes["btn-send_message"]}
          >
            <IoIosSend />
          </button>
        </div>
      </main>
    </LayoutChat>
  );
}
