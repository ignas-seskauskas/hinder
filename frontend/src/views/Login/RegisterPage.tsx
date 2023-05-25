import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../../constants/api";
import { SessionStorageKey } from "../../constants/sessionStorage";
import { UserType } from "../../interfaces/User";
import { getAuthData } from "../../utils/getAuthData";
import { sha256 } from "js-sha256";

type RegisterFormData = {
  nickname: string;
  password: string;
  email: string;
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const [error, setError] = useState("");

  const onSubmit = (data: RegisterFormData) => {
    setError("");

    const tryToRegister = async () => {
      const response = await fetch(`${BASE_API_URL}/register`, {
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

          // if (userType === UserType.Admin) {
          //   navigate("/home");
          // } else if (userType === UserType.HobbyFinder) {
          //   navigate("/hobby/list");
          // }
          navigate("/login");
        }
      } else {
        setError((await response.json()).error);
      }
    };

    tryToRegister();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Register page</h2>
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
        type="email"
        placeholder="Email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "Invalid email address",
          },
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}
      <br />
      <input
        type="password"
        placeholder="Password"
        {...register("password", { required: "Password is required" })}
      />
      {errors.password && <p>{errors.password.message}</p>}
      <br />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
