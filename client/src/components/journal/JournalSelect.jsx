import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { useJournals } from "../../hooks/useJournals";
import JournalGrid from "./JournalGrid";
import EmptyState from "./EmptyState";
import UnauthenticatedView from "./UnauthenticatedView";

/**
 * Main journal selection component - now simplified to orchestrate child components
 * All business logic moved to useJournals hook, all UI moved to presentational components
 */
export default function JournalSelect() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { journals, loading, createJournal, deleteJournal, editJournal, uploadImage} = useJournals();
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
            <div className="grid items-center min-h-screen px-4 bg-[url(images/journaldeepnight.jpg) bg-center] bg-no-repeat bg-cover">
                <div className="text-amber-100 text-center border-4 border-blue-200 rounded-lg p-10 max-w-md justify-self-center bg-linear-to-r from-gray-600 via-gray-700 to-gray-900">
                    <h1 className="text-2xl">Loading your journals...</h1>
                </div>
            </div>
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