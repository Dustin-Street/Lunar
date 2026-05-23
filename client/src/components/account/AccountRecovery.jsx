import { useState } from "react";
import useAccount from "../../hooks/useAccount";

export default function AccountRecovery() {
  const {
    sendEmailRecovery,
    sendPasswordReset,
    checkIfUsernameExists,
    checkIfEmailExists,
  } = useAccount();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const sendRecoveryEmail = (e) => {
    e.preventDefault();
    checkIfUsernameExists(username);

    if (checkIfUsernameExists(username)) {
      sendEmailRecovery(username, password);
    }
  };

  const sendPasswordResetEmail = (e) => {
    e.preventDefault();
    checkIfEmailExists(email);

    if (checkIfEmailExists(email)) {
      sendPasswordReset(email);
    }
  };

  return (
    <div className="h-dvh flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat bg-[url(/images/starrysky2.jpg)]">
      <h1 className="text-3xl text-amber-100 mb-6 font-semibold font-serif border-b-2 border-amber-100 mt-6 p-2 w-3/4 max-w-md text-center bg-gray-700/98 rounded-lg shadow-lg">
        Account Recovery
      </h1>
      <div
        name="emailRecoveryCard"
        className="bg-gray-700/98 p-8 rounded-2xl shadow-lg text-center text-amber-100 w-3/4 max-w-md m-4 border-2 border-amber-100"
      >
        <p className="text-2xl text-blue-200 border-b p-2">
          Forgot your Email?
        </p>
        Enter the username and password associated with your account, and we'll
        send you a link to recover your email.
        <form className="mt-4" onSubmit={sendRecoveryEmail}>
          <label htmlFor="recovery-username" className="sr-only">
            Username
          </label>
          <input
            id="recovery-username"
            type="text"
            required={true}
            placeholder="Enter your username"
            className="p-2 rounded w-full text-amber-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="recovery-password" className="sr-only">
            Password
          </label>
          <input
            id="recovery-password"
            required={true}
            type="password"
            placeholder="Enter your password"
            className="p-2 rounded w-full text-amber-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="mt-4 p-2 text-black bg-blue-300 rounded w-full  hover:shadow-md transform hover:-translate-y-px hover:shadow-cyan-100 hover:bg-blue-400"
          >
            Send Reset Link
          </button>
          <p className="text-sm text-gray-400 mt-2">
            Don't have the username? Try another way - more options available.
          </p>
        </form>
      </div>
      <div
        name="PasswordRecoveryCard"
        className="bg-gray-700/98 p-8 rounded-2xl shadow-lg text-center text-amber-100 w-3/4 max-w-md m-4 mb-2 border-2 border-amber-100"
      >
        <p className="text-2xl text-blue-200 border-b p-2">
          Forgot your Password?
        </p>
        Enter the email associated with your account, and we'll send you a link
        to reset your password.
        <form className="mt-4" onSubmit={sendPasswordResetEmail}>
          <label htmlFor="recovery-email" className="sr-only">
            Email address
          </label>
          <input
            id="recovery-email"
            required={true}
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded w-full text-amber-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="mt-4 p-2 text-black bg-blue-300 rounded w-full  hover:shadow-md transform hover:-translate-y-px hover:shadow-cyan-100 hover:bg-blue-400"
          >
            Send Reset Link
          </button>
        </form>
        <p className="mt-6">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-200 hover:underline">
            Sign up
          </a>
        </p>
        <p className="mt-2">
          <a href="/login" className="text-blue-200 hover:underline">
            Back to Login
          </a>
        </p>
        <p className="mt-4 text-sm text-gray-400">
          If you don't receive an email, please check your spam folder or
          contact support.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          For security reasons, we won't disclose whether an email is associated
          with an account.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          This link will expire in 1 hour.
        </p>
      </div>
    </div>
  );
}
