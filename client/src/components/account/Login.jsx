import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAccount from "../../hooks/useAccount";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

//logout functionality lives in Navbar.jsx

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userLogin } = useAccount();

  return (
    <div>
      <div className="@container grid grid-col-1 justify-center h-dvh items-center bg-[url(/images/starrysky2.jpg)] bg-cover bg-no-repeat lg:bg-blue-200">
        <div className="flash-slot h-14">
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            userLogin(email, password);
          }}
          id="formSignup"
          className="border-3 p-17 rounded-2xl border-blue-200 bg-gray-700 max-w-105"
        >
          <h1 className="text-3xl text-amber-100 justify-self-center translate-y-1 font-semibold font-serif">
            Login
          </h1>

          <div>
            <div className="my-10 border-3 border-blue-200 py-3 px-10 rounded-2xl inline-block shadow-2xl">
              <input
                className="bg-gray-200 rounded p-1.5 text-black"
                type="text"
                autoComplete="email"
                placeholder="Email"
                value={email}
                name="email"
                onChange={(event) => setEmail(event.target.value)}
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
              />
            </div>
          </div>

          <button
            className="p-3 block rounded-2xl border-3 justify-self-center border-blue-200 bg-blue-300 hover:text-yellow-100 hover:bg-blue-200 hover:shadow-lg transform hover:-translate-y-px hover:shadow-cyan-100"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
