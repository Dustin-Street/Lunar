import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FlashMessage from "../layout/FlashMessage";
import { useFlashMessage } from "../context/FlashMessageContext";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { setFlashMessage } = useFlashMessage();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const handleSubmitSignUp = async (event) => {
    event.preventDefault();
    const userData = { email, username, password };
    const axiosOptions = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    try {
      const response = await axios.post(
        "http://localhost:5050/account/createUser",
        userData,
        axiosOptions,
      );
      console.log(response);
      login(response.data.user, response.data.token);
      navigate("/").then(() => {
        setFlashMessage(
          "Signup successful, " + response.data.user.username + "!",
        );
      });
      resetForm();
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message || error);
      const serverMsg =
        error?.response?.data?.message || error?.response?.data?.error;

      setMessage(serverMsg || error?.message || "Signup failed, try again...");
    }
  };

  return (
    <div
      className="
    min-h-screen
    grid place-items-center
    bg-[url('/images/booksUpscale2.jpg')]
    bg-center bg-no-repeat bg-cover
    px-4
  "
    >
      <div className={message ? "h-14" : "h-0"}>
        {message && <FlashMessage newMessage={message} />}
      </div>

      <form
        onSubmit={handleSubmitSignUp}
        id="formSignup"
        className=" border-3 p-17 rounded-2xl border-blue-200 bg-gray-700 max-w-105 w-105 "
      >
        <h1 className="text-3xl text-amber-100 justify-self-center translate-y-1 font-semibold font-serif">
          Sign Up
        </h1>
        <div className="">
          <div className="my-10 border-3 border-blue-200 py-3 px-10 rounded-2xl inline-block shadow-2xl">
            <input
              className=" bg-gray-200 rounded p-1.5 text-black"
              type="email"
              autoComplete="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <div className="my-10 border-3 border-blue-200 py-3 px-10 rounded-2xl inline-block shadow-2xl">
            <input
              className=" bg-gray-200 rounded p-1.5 text-black"
              type="text"
              autoComplete="off"
              placeholder="Username"
              value={username}
              name="username"
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <div className="my-10 border-3 border-blue-200 py-3 px-10 rounded-2xl inline-block shadow-2xl">
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              name="password"
              id="password"
              value={password}
              className="bg-gray-200 rounded p-1.5"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
        </div>
        <button
          className=" p-3 block rounded-2xl border-3 justify-self-center border-blue-200 bg-blue-300 hover:bg-blue-200 transform hover:-translate-y-px hover:shadow-cyan-100"
          type="submit"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
