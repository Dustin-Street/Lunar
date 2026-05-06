import { useState, useEffect } from "react";
import useAccount from "../../hooks/useAccount";
import {
  validateEmail,
  sanitizeInput,
  RateLimiter,
} from "../../utils/security";

//logout functionality lives in Navbar.jsx

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { userLogin } = useAccount();

  // Rate limiter for login attempts (5 attempts per minute)
  const loginLimiter = new RateLimiter(5, 60000);

  // Clear errors when inputs change
  useEffect(() => {
    if (emailError && email) setEmailError("");
  }, [email, emailError]);

  useEffect(() => {
    if (passwordError && password) setPasswordError("");
  }, [password, passwordError]);

  const validateForm = () => {
    let isValid = true;

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    // Check rate limit
    if (!loginLimiter.isAllowed()) {
      const timeUntilReset = Math.ceil(loginLimiter.getTimeUntilReset() / 1000);
      setEmailError(
        `Too many login attempts. Try again in ${timeUntilReset} seconds.`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize inputs before sending
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedPassword = password; // Don't sanitize password as it might contain special chars

      await userLogin(sanitizedEmail, sanitizedPassword);
    } catch (error) {
      // Error handling is done in useAccount hook
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="@container grid grid-col-1 justify-center h-dvh items-center bg-[url(/images/starrysky2.jpg)] bg-cover bg-no-repeat lg:bg-blue-200">
        <form
          onSubmit={handleSubmit}
          id="formLogin"
          className="border-3 p-17 rounded-2xl border-blue-200 bg-gray-700 max-w-105"
        >
          <h1 className="text-3xl text-amber-100 justify-self-center translate-y-1 font-semibold font-serif">
            Login
          </h1>

          <div>
            <div className="mt-10 border-3 border-blue-200 py-3 px-10 rounded-2xl inline-block shadow-2xl">
              <input
                className={`bg-gray-200 rounded p-1.5 text-black ${emailError ? "border-red-500" : ""}`}
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                name="email"
                onChange={(event) =>
                  setEmail(sanitizeInput(event.target.value))
                }
                disabled={isSubmitting}
                maxLength={254}
              />
            </div>
            {emailError && (
              <p className="text-red-400 text-sm mt-1 ml-10 justify-self-start animate-pulse ">{emailError}</p>
            )}
          </div>

          <div className="mt-10 border-3 border-blue-200 py-3 px-10 rounded-2xl inline-block shadow-2xl">
            <div className="flex items-center bg-gray-200 rounded p-1.5">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                name="password"
                id="password"
                value={password}
                className={`bg-gray-200 max-w-36 flex-1 outline-none ${passwordError ? "border-red-500" : ""}`}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                maxLength={128}
              />

              <button
                type="button"
                className="text-gray-600 ml-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>

            
          </div>
            {passwordError && (
              <p className="text-red-400 text-sm mt-1 ml-10 justify-self-start animate-pulse">{passwordError}</p>
            )}
          <button
            className={`p-3 block rounded-2xl border-3 justify-self-center border-blue-200 bg-blue-400 hover:text-white hover:border-amber-200 hover:shadow-lg transform hover:-translate-y-px my-8 mx-4 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-amber-100 text text-center">
            Don't have an account yet?{" "}
            <a
              href="/signup"
              className="text-blue-200 hover:underline hover:text-blue-300"
            >
              Sign up
            </a>
          </p>
          <p className="mt-4 text-amber-100 text text-center">
            <a
              href="/accountRecovery"
              className="text-blue-200 hover:underline hover:text-blue-300"
            >
              Forgot your password or email?
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
