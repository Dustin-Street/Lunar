import { useAuth } from "../context/AuthContext";
import { useJournals } from "../../hooks/useJournals";
import JournalGrid from "./JournalGrid";
import EmptyState from "./EmptyState";
import UnauthenticatedView from "./UnauthenticatedView";
import LoadingOverlay from "../layout/LoadingOverlay";
import getRandomLoadingString from "../../utils/randomLoadingString";



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
 

  const randomString = getRandomLoadingString();

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
    return LoadingOverlay({ message: randomString });
  }

  // Show empty state if user has no journals
  if (journals.length === 0) {
    return <EmptyState onCreate={createJournal} journals={journals} />;
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
