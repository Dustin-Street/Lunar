import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useJournals } from "../../hooks/useJournals";
import JournalGrid from "./JournalGrid";
import EmptyState from "./EmptyState";
import UnauthenticatedView from "./UnauthenticatedView";
import LoadingOverlay from "../layout/LoadingOverlay";

const randomLoadingStrings = [
  "Gathering your thoughts from the ether…",
  "Dusting off your journals…",
  "Lighting a small lantern for your memories…",
  "Opening the pages where you left off…",
  "Collecting your entries… gently.",
  "Your journals are waking up…",
  "Retrieving the stories you’ve written…",
  "Preparing your space to reflect…",
  "Fetching the pages that matter today…",
  "Your words are finding their way back…",
  "Unfolding your past moments…",
  "Letting your journals settle in…",
  "Bringing your reflections into view…",
  "Your thoughts are almost here…",
  "Softly gathering your entries…",
  "Aligning your memories…",
  "Your journals are opening their eyes…",
  "Calling your pages home…",
  "Your reflections are on their way…",
  "Centering your journaling space…"
];
const randomString = randomLoadingStrings[
  Math.floor(Math.random() * randomLoadingStrings.length)]

/**
 * Main journal selection component - now simplified to orchestrate child components
 * All business logic moved to useJournals hook, all UI moved to presentational components
 * 
 * 
 */
export default function JournalSelect() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    journals,
    loading,
    createJournal,
    deleteJournal,
    editJournal,
    uploadImage,
  } = useJournals();
  const navigate = useNavigate();

  // Show loading state while authentication is being verified
  if (authLoading) {
    return <UnauthenticatedView isLoading={true} />;
  }

  // Show login/signup prompt for unauthenticated users
  if (!isAuthenticated) {
    return <UnauthenticatedView />;
  }

  // Show loading state while journals are being fetched
  if (loading) {
    return (
      LoadingOverlay({message: randomString})
    );
  }

  // Show empty state if user has no journals
  if (journals.length === 0) {
    return <EmptyState onCreate={createJournal} />;
  }

  // Show journal grid with all journals
  return (
    <JournalGrid
      //passing down from UseJounral Hook
      journals={journals}
      Delete={deleteJournal}
      Edit={editJournal}
      Create={createJournal}
      Upload={uploadImage}
    />
  );
}
