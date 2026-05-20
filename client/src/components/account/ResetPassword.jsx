import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAccount from "../../hooks/useAccount";
import LoadingOverlay from "../layout/LoadingOverlay.jsx";
import { useFlashMessage } from "../context/FlashMessageContext.jsx";
import logger from "../../utils/logger.js";

export default function ResetPassword() {
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();
  const { changePasswordReset, checkResetToken } = useAccount();

  const [searchParams] = useSearchParams();
  const tokenString = searchParams.get("token");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    logger("info", "Reset token from URL:", tokenString); // Debug log to check the token value
    if (!tokenString) {
      setFlashMessage("No reset token provided.", "error");
      navigate("/login");
    }
  }, [tokenString, navigate, setFlashMessage]);

  useEffect(() => {
    const verifyResetToken = async () => {
      logger("info", "Verifying reset token:", tokenString); // Debug log to check the token value before verification
      logger("info", "Checking reset token validity..."); // Debug log to indicate the verification process has started
      const isValid = await checkResetToken(tokenString);
      logger("info", "Reset token validity result:", isValid); // Debug log to check the result of token verification

      if (!isValid) {
        setFlashMessage("Invalid or expired reset token.", "error");
        navigate("/login");
        return;
      }

      setFlashMessage(
        "Token verified! Please enter your new password.",
        "success",
      );
    };

    verifyResetToken();
  }, [tokenString]); // keep tokenString in dependency array to re-run if it changes (e.g. user clicks a different reset link)

  if (tokenString === null || tokenString === undefined || isSubmitting) {
    return (
      <div className="h-dvh flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url(/images/starrysky2.jpg)]">
        <LoadingOverlay message="Checking things on our end..." />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    await changePasswordReset(password);

    setPasswordError("");
    setConfirmPasswordError("");
    setConfirmPassword("");
    setPassword("");
  };

  return (
    <div className="h-dvh flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url(/images/starrysky2.jpg)]">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-700/98 p-8 rounded-2xl shadow-lg text-center text-amber-100 w-3/4 max-w-md m-4 border-2 border-amber-100"
      >
        <div className="mt-10 border-3  border-blue-200 py-3 px-4 sm:px-12 rounded-2xl shadow-2xl justify-self-center">
          <div className="flex items-center bg-gray-200 rounded p-1.5">
            <label htmlFor="login-password" className="sr-only">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              name="password"
              id="login-password"
              value={password}
              className={`bg-gray-200 max-w-36 flex-1 outline-none ${passwordError ? "border-red-500" : ""}`}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              maxLength={128}
              aria-invalid={!!passwordError}
              maxLength={128}
              aria-invalid={!!passwordError}
              aria-describedby={
                passwordError ? "login-password-error" : undefined
              }
            />

            <button
              type="button"
              className="text-gray-600 ml-2"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "hide" : "show"}
            </button>
          </div>
        </div>
        {passwordError && (
          <p
            id="login-password-error"
            className="text-red-400 text-sm mt-1 ml-10 justify-self-start animate-pulse"
          >
            {passwordError}
          </p>
        )}
        <div className="mt-10 border-3  border-blue-200 py-3 px-4 sm:px-12 rounded-2xl shadow-2xl justify-self-center">
          <div className="flex items-center bg-gray-200 rounded p-1.5">
            <label htmlFor="login-password" className="sr-only">
              Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Confirm Password"
              name="confirmPassword"
              id="login-confirm-password"
              value={confirmPassword}
              className={`bg-gray-200 max-w-36 flex-1 outline-none ${confirmPasswordError ? "border-red-500" : ""}`}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={isSubmitting}
              maxLength={128}
              aria-invalid={!!confirmPasswordError}
              maxLength={128}
              aria-invalid={!!confirmPasswordError}
              aria-describedby={
                confirmPasswordError
                  ? "login-confirm-password-error"
                  : undefined
              }
            />

            <button
              type="button"
              className="text-gray-600 ml-2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? "hide" : "show"}
            </button>
          </div>
        </div>
        {confirmPasswordError && (
          <p
            id="login-confirm-password-error"
            className="text-red-400 text-sm mt-1 ml-10 justify-self-start animate-pulse"
          >
            {confirmPasswordError}
          </p>
        )}
      </form>
    </div>
  );
}
