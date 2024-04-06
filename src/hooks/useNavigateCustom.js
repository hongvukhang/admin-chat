import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notDisplay } from "../redux/showAlertSlice";
export default function useNavigateCustom() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (url) => {
    dispatch(notDisplay());
    navigate(url);
  };
}
