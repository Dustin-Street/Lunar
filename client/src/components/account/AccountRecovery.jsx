export default function AccountRecovery() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-cover bg-no-repeat bg-[url(/images/starrysky2.jpg)]">
      <h1 className="text-3xl text-amber-100 mb-6 font-semibold font-serif absolute top-16">
        Account Recovery
      </h1>
      <div
        name="emailRecoveryCard"
        className="bg-gray-700/98 p-8 rounded-2xl shadow-lg text-center text-amber-100 w-3/4 max-w-md m-4 border-2 border-amber-100"
      >
        <p className="text-2xl text-blue-200 border-b p-2">
          Forgot Email to your account?
        </p>
        Enter the username associated with your account, and we'll send you a
        link to reset your recovery method selected on Signup.
        <form className="mt-4">
          <label htmlFor="recovery-username" className="sr-only">
            Username
          </label>
          <input
            id="recovery-username"
            type="text"
            placeholder="Enter your username"
            className="p-2 rounded w-full text-amber-100 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="mt-4 p-2 text-black bg-blue-300 rounded w-full  hover:shadow-lg transform hover:-translate-y-px hover:shadow-cyan-100"
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
        <form className="mt-4">
          <label htmlFor="recovery-email" className="sr-only">
            Email address
          </label>
          <input
            id="recovery-email"
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded w-full text-amber-100 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="mt-4 p-2 text-black bg-blue-300 rounded w-full  hover:shadow-lg transform hover:-translate-y-px hover:shadow-cyan-100"
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
      <div
        name="supportCard"
        className=" bg-gray-700/98 p-8 rounded-2xl shadow-lg text-center m-2 w-3/4 max-w-md border-2 border-amber-100"
      >
        <p className="text-amber-100 text-2xl border-b m-5 p-2"> Support </p>

        <p className="text-amber-100 text-lg">
          If you're having trouble with account recovery, please contact our
          support team at{" "}
          <a
            href="mailto:support@example.com"
            className="text-blue-200 hover:underline"
          >
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
}
