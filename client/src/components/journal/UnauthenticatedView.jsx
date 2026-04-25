import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../layout/LoadingOverlay";
import LoginSignupCard from "../layout/LoginSignupCard";

/**
 * View shown to unauthenticated users
 * Prompts them to sign up or log in
 */
export default function UnauthenticatedView({ isLoading = false }) {
  const navigate = useNavigate();

  if (isLoading) {
    return LoadingOverlay({ message: "loading..." });
  }

  return (
    <div className="grid items-center min-h-screen px-4 bg-[url(/images/journaldeepnight.jpg)] bg-no-repeat bg-cover bg-center gap-10 position-fixed">
      <LoginSignupCard />
    </div>
  );
}
