import { useState } from "react";
import useAccount from "../../hooks/useAccount";
import {
  validateEmail,
  validateUsername,
  validatePassword,
  sanitizeInput,
  RateLimiter,
} from "../../utils/security";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userSignup } = useAccount();

  // Rate limiter for signup attempts (3 attempts per hour)
  const signupLimiter = new RateLimiter(3, 3600000);

  // Clear field errors when the user edits the inputs

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

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    } else if (!usernameValidation.isValid) {
      setUsernameError(usernameValidation.errors[0]);
      isValid = false;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors[0]);
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    // Check rate limit
    if (!signupLimiter.isAllowed()) {
      const timeUntilReset = Math.ceil(
        signupLimiter.getTimeUntilReset() / 1000 / 60,
      );
      setEmailError(
        `Too many signup attempts. Try again in ${timeUntilReset} minutes.`,
      );
      return;
    }

    setIsSubmitting(true);
    setEmailError("");
    setUsernameError("");
    setPasswordError("");

    try {
      // Sanitize inputs before sending
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedUsername = sanitizeInput(username);
      const sanitizedPassword = password; // Don't sanitize password

      await userSignup(sanitizedEmail, sanitizedUsername, sanitizedPassword);
    } catch (error) {
      // Error handling is done in useAccount hook
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <img
        src="/images/starrysky2.webp"
        alt=""
        className="hidden"
        fetchPriority="high"
      />
      <div className="min-h-screen w-full flex items-center justify-center bg-[url('/images/starrysky2.webp')] bg-cover bg-center bg-no-repeat">
        <form
          onSubmit={handleSubmit}
          id="formSignup"
          className="border-3 p-4 sm:p-17 rounded-2xl border-blue-200 bg-gray-700 max-w-sm min-w-26 max-h-screen"
        >
          <h1 className="text-3xl text-amber-100 justify-self-center translate-y-1 font-semibold font-serif">
            Sign Up
          </h1>

          {/* EMAIL */}
          <div className="mt-10 border-3 border-blue-200 py-3 px-4 sm:px-12 rounded-2xl shadow-2xl justify-self-center">
            <label htmlFor="signup-email" className="sr-only">
              Email address
            </label>
            <input
              id="signup-email"
              className={`bg-gray-200 shrink rounded p-1.5 text-black ${emailError ? "border-red-500" : ""}`}
              type="email"
              autoComplete="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(event) => {
                setEmail(sanitizeInput(event.target.value));
                if (emailError) setEmailError("");
              }}
              disabled={isSubmitting}
              maxLength={254}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "signup-email-error" : undefined}
            />
          </div>

          {emailError && (
            <p
              id="signup-email-error"
              className="text-red-400 text-sm mt-1 ml-10 justify-self-start animate-pulse"
            >
              {emailError}
            </p>
          )}

          {/* USERNAME */}
          <div className="mt-10 border-3 border-blue-200 py-3 px-4 sm:px-12 rounded-2xl shadow-2xl justify-self-center">
            <label htmlFor="signup-username" className="sr-only">
              Username
            </label>
            <input
              id="signup-username"
              className={`bg-gray-200 shrink rounded p-1.5 text-black ${usernameError ? "border-red-500" : ""}`}
              type="text"
              autoComplete="off"
              placeholder="Username"
              value={username}
              name="username"
              onChange={(event) => {
                setUsername(sanitizeInput(event.target.value));
                if (usernameError) setUsernameError("");
              }}
              disabled={isSubmitting}
              maxLength={30}
              aria-invalid={!!usernameError}
              aria-describedby={
                usernameError ? "signup-username-error" : undefined
              }
            />
          </div>

          {usernameError && (
            <p
              id="signup-username-error"
              className="text-red-400 text-sm mt-1 ml-10 justify-self-start animate-pulse"
            >
              {usernameError}
            </p>
          )}

          {/* PASSWORD */}
          
            <div className="grid mt-10 border-3 border-blue-200 py-3 px-4 sm:px-12 rounded-2xl shadow-2xl justify-self-center">
              <label htmlFor="signup-password" className="sr-only">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                name="password"
                id="signup-password"
                value={password}
                className={`bg-gray-200 shrink rounded p-1.5 row-start-1 col-start-1 text-black ${passwordError ? "border-red-500" : ""}`}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (passwordError) setPasswordError("");
                }}
                disabled={isSubmitting}
                maxLength={128}
                aria-invalid={!!passwordError}
                aria-describedby={
                  passwordError ? "signup-password-error" : undefined
                }
              />

              <button
                type="button"
                className="text-gray-600 ml-2 hover:text-amber-100"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>
          

          {passwordError && (
            <p
              id="signup-password-error"
              className="text-red-400 text-sm mt-1 ml-10 justify-self-start animate-pulse"
            >
              {passwordError}
            </p>
          )}

          {/* SUBMIT */}
          <button
            className={`p-3 block rounded-2xl border-3 justify-self-center border-blue-200 bg-blue-400 hover:text-white hover:border-amber-200 hover:shadow-lg transform hover:-translate-y-px my-8 mx-4 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>

          {/* LINK */}
          <p className="mt-4 text-amber-100 text text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-200 hover:underline hover:text-blue-300"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
