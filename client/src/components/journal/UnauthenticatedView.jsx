import { useNavigate } from "react-router-dom";

/**
 * View shown to unauthenticated users
 * Prompts them to sign up or log in
 */
export default function UnauthenticatedView({ isLoading = false }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid items-center min-h-screen px-4 bg-[url(/images/journaldeepnight.jpg) bg-center] bg-no-repeat bg-cover">
        <div className="text-amber-100 text-center border-4 border-blue-200 rounded-lg p-10 max-w-md justify-self-center bg-linear-to-r from-gray-600 via-gray-700 to-gray-900">
          <h1 className="text-2xl">Loading...</h1>
          <div className="animate-pulse p-4 border rounded-lg space-y-4">
            <div className="rounded-lg p-10 max-w-md justify-self-center bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-center min-h-screen px-4 bg-[url(/images/journaldeepnight.jpg)] bg-no-repeat bg-cover bg-center gap-10 position-fixed">
      <div className="text-amber- text-center border-4 border-blue-200 rounded-lg p-10 max-w-md justify-self-center bg-linear-to-r from-gray-600 via-gray-700 to-gray-900">
        <h1 className="md:text-3xl sm:text-2xl text-amber-100">
          Create an account to get started or log in if you already have an
          account
        </h1>
        <button
          onClick={() => navigate("/signup")}
          className="m-5 mt-5 border-2 border-blue-200 rounded-md py-2 px-4 bg-blue-200 hover:bg-blue-300 hover:cursor-pointer hover:shadow-lg shadow-cyan-100 hover:text-amber-100"
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate("/login")}
          className="m-5 mt-5 border-2 border-blue-200  bg-blue-200 rounded-md py-2 px-4  hover:bg-blue-300 hover:cursor-pointer hover:shadow-lg shadow-cyan-100 hover:text-amber-100"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
