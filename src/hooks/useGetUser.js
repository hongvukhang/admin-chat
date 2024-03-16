import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useGetUser(data) {
  const [user, setUser] = useState({
    userName: "Default",
    msg: {},
    avatar: window.location.origin + "/images/avatar.png",
    connecting: { status: false, time_out_of: new Date() },
  });
  //calculate time
  const calculateTime = (time) => {
    const TOO = new Date(time);

    const currentTime = new Date();

    const spaceTime = (currentTime - TOO) / 3600000;

    const data = {
      time: null,
      unit: null,
    };

    if (spaceTime < 1) {
      data.time = ((spaceTime - spaceTime.toFixed()) * 60).toFixed();
      data.unit = "Phút";
    } else if (spaceTime >= 1 && spaceTime < 24) {
      data.time = spaceTime.toFixed();
      data.unit = "Giờ";
    }
    return data;
  };

  useEffect(() => {
    axios.get(`/get-user/${data.user}`).then((res) => {
      const setData = {
        userName: res.data.userName,
        avatar: res.data.avatar,
        msg: data.messages && {
          ...data.messages,
        },
        connecting: {
          ...res.data.connecting,
          time: calculateTime(res.data.connecting.time_out_of),
        },
      };
      setUser(setData);
    });
  }, [data]);
  return user;
}
