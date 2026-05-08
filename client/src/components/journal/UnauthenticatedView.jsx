import LoadingOverlay from "../layout/LoadingOverlay";
import LoginSignupCard from "../layout/LoginSignupCard";

/**
 * View shown to unauthenticated users
 * Prompts them to sign up or log in
 */
export default function UnauthenticatedView({ isLoading = false }) {
  if (isLoading) {
    return LoadingOverlay({ message: "loading..." });
  }

  return (
    <div>
      <img
        src="/images/journaldeepnight2.webp"
        alt=""
        className="hidden"
        fetchPriority="high"
      />
      <div className="grid items-center min-h-screen px-4 bg-[url('/images/journaldeepnight2.webp')] bg-no-repeat bg-cover bg-center gap-10 position-fixed">
        <LoginSignupCard />
      </div>
    </div>
  );
}
