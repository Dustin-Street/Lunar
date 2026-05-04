import { useState, useEffect } from "react";
import useAccount from "../../hooks/useAccount";
import { validateEmail, validatePassword, validateUsername, sanitizeInput, RateLimiter } from "../../utils/security";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userSignup } = useAccount();

  // Rate limiter for signup attempts (3 attempts per hour)
  const signupLimiter = new RateLimiter(3, 3600000);

  // Clear errors when inputs change
  useEffect(() => {
    if (emailError && email) setEmailError("");
  }, [email, emailError]);

  useEffect(() => {
    if (passwordError && password) setPasswordError("");
  }, [password, passwordError]);

  useEffect(() => {
    if (usernameError && username) setUsernameError("");
  }, [username, usernameError]);

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
      const timeUntilReset = Math.ceil(signupLimiter.getTimeUntilReset() / 1000 / 60);
      setEmailError(`Too many signup attempts. Try again in ${timeUntilReset} minutes.`);
      return;
    }

    setIsSubmitting(true);

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
        onSubmit={handleSubmit}
        id="formSignup"
        className=" border-3 p-17 rounded-2xl border-blue-200 bg-gray-700 max-w-105 w-105 "
      >
        <h1 className="text-3xl text-amber-100 justify-self-center translate-y-1 font-semibold font-serif">
          Sign Up
        </h1>

        <div className="">
          <div className="my-10 border-3 border-blue-200 py-3 px-10 rounded-2xl inline-block shadow-2xl">
            <input
              className={`bg-gray-200 rounded p-1.5 text-black ${emailError ? 'border-red-500' : ''}`}
              type="email"
              autoComplete="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(event) => setEmail(sanitizeInput(event.target.value))}
              disabled={isSubmitting}
              maxLength={254}
              required
            />
          </div>
          {emailError && (
            <p className="text-red-400 text-sm mt-1 ml-10">{emailError}</p>
          )}
        </div>

        <div>
          <div className="my-10 border-3 border-blue-200 py-3 px-10 rounded-2xl inline-block shadow-2xl">
            <input
              className={`bg-gray-200 rounded p-1.5 text-black ${usernameError ? 'border-red-500' : ''}`}
              type="text"
              autoComplete="off"
              placeholder="Username"
              value={username}
              name="username"
              onChange={(event) => setUsername(sanitizeInput(event.target.value))}
              disabled={isSubmitting}
              maxLength={30}
              required
            />
          </div>
          {usernameError && (
            <p className="text-red-400 text-sm mt-1 ml-10">{usernameError}</p>
          )}
        </div>

        <div>
          <div className="my-10 border-3 border-blue-200 py-3 px-10 rounded-2xl inline-block shadow-2xl">
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Password"
              name="password"
              id="password"
              value={password}
              className={`bg-gray-200 rounded p-1.5 ${passwordError ? 'border-red-500' : ''}`}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              maxLength={128}
              required
            />
          </div>
          {passwordError && (
            <p className="text-red-400 text-sm mt-1 ml-10">{passwordError}</p>
          )}
        </div>

        <button
          className={`p-3 block rounded-2xl border-3 justify-self-center border-blue-200 bg-blue-400 hover:text-white hover:border-amber-200 hover:shadow-lg transform hover:-translate-y-px my-8 mx-4 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="mt-4 text-amber-100 text text-center">
          already have an account?{" "}
          <a
            href="/login"
            className="text-blue-200 hover:underline hover:text-blue-300"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
