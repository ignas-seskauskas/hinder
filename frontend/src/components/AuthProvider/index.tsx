import { ReactNode, useEffect } from "react";
import { getAuthData } from "../../utils/getAuthData";
import { UserType } from "../../interfaces/User";
import { useLocation, useNavigate } from "react-router-dom";

type AuthWrapperProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthWrapperProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authData = getAuthData();
    if (!authData) {
      const pathname = location.pathname;

      if (
        pathname !== "/" &&
        pathname !== "/login" &&
        pathname !== "/register"
      ) {
        navigate("/");
      }
    }
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
