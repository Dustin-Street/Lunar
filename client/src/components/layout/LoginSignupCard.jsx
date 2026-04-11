export default function LoginSignupCard() {
  return (
    <div className=" bg-gray-700/78 rounded-2xl p-6 max-w-2xl text-center text-amber-100 shadow-sm shadow-blue-200 animate-fadeIn md:text-xl lg:text-2xl font-serif">
        <h2>-- Get Started By signing up Free --</h2>
        <button
          className="p-3 block rounded-2xl border-3 justify-self-center border-blue-200 bg-blue-300 hover:text-yellow-200 hover:border-amber-200 hover:bg-blue-200 hover:shadow-lg transform hover:-translate-y-px hover:shadow-cyan-100 mt-4"
          onClick={() => {
            window.location.href = "/signup";
          }}
        >
          Signup
        </button>
        <h1 className="border-t-2 m-4 pt-4">Already have an account?</h1>
        <button
          className="p-3 block rounded-2xl border-3 justify-self-center border-blue-200 bg-blue-300 hover:text-yellow-200 hover:border-amber-200 hover:bg-blue-200 hover:shadow-lg transform hover:-translate-y-px hover:shadow-cyan-100"
          onClick={() => {
            window.location.href = "/login";
          }}
        >
          Login
        </button>
      </div>
  );
}

