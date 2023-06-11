import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../../constants/api";
import { SessionStorageKey } from "../../constants/sessionStorage";
import { getAuthData } from "../../utils/getAuthData";
import { UserType } from "../../interfaces/User";
import { sha256 } from "js-sha256";

type LoginFormData = {
  nickname: string;
  password: string;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [error, setError] = useState("");

  const onSubmit = (data: LoginFormData) => {
    setError("");

    const tryToLogin = async () => {
      const response = await fetch(`${BASE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, password: sha256(data.password) }),
      });

      if (response.ok) {
        sessionStorage.setItem(
          SessionStorageKey.Login,
          JSON.stringify(await response.json())
        );

        const authData = getAuthData();
        if (authData) {
          const userType = authData.type;

          if (userType === UserType.Admin) {
            navigate("/admin");
          } else if (userType === UserType.HobbyFinder) {
            navigate("/home");
          }
        }
      } else {
        setError((await response.json()).error);
      }
    };

    tryToLogin();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Login page</h2>
      {error && (
        <p>
          {error}
          <br />
        </p>
      )}
      <input
        type="text"
        placeholder="Username"
        {...register("nickname", { required: "Username is required" })}
      />
      {errors.nickname && <p>{errors.nickname.message}</p>}
      <br />
      <input
        type="password"
        placeholder="Password"
        {...register("password", { required: "Password is required" })}
      />
      {errors.password && <p>{errors.password.message}</p>}
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
