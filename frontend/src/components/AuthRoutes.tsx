import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const AuthRoutes = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  return userInfo ? children : null;
};

export default AuthRoutes;
