import { useRef, useState } from "react";
import classes from "./Search.module.css";
import { CiSearch } from "react-icons/ci";
import { MdOutlineClear } from "react-icons/md";
export default function Search({ search }) {
  const [toggle, setToggle] = useState(true);
  const userNameRef = useRef();
  return (
    <>
      {!toggle && (
        <div className={classes["container-open"]}>
          <MdOutlineClear
            onClick={() => {
              search("");
              setToggle((toggle) => !toggle);
            }}
          />
          <input type="text" placeholder="User Name" ref={userNameRef} />
          <CiSearch onClick={() => search(userNameRef.current.value)} />
        </div>
      )}
      {toggle && (
        <div className={classes["container-close"]}>
          <MdOutlineClear />

          <CiSearch onClick={() => setToggle((toggle) => !toggle)} />
        </div>
      )}
    </>
  );
}
