import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFlashMessage } from "../context/FlashMessageContext";
import { useAuth } from "../context/AuthContext";
import useAccount from "../../hooks/useAccount";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { userSignup } = useAccount();

  return (
    <div
      className="
    min-h-screen
    grid place-items-center
    bg-[url('/images/starrysky2.jpg')]
    bg-center bg-no-repeat bg-cover
    px-4
  "
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          userSignup(email, username, password);
        }}
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
