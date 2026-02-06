import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../components/context/AuthContext";
import { useFlashMessage } from "../components/context/FlashMessageContext";

/**
 * Custom hook for managing journal-related state and operations
 * Encapsulates all journal CRUD operations and data fetching logic
 */
export function useJournals() {
    const [journals, setJournals] = useState([]);
    const [journalTitles, setJournalTitles] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { setFlashMessage, setToggleButton, setDuration } = useFlashMessage();

    // Fetch journals when user is available
    useEffect(() => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        async function fetchUserJournals() {
            const userID = user.id;
            console.log('Fetching journals for user ID:', userID);
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5050/journals/${userID}`, {
                    withCredentials: true,
                });
                const data = response.data;
                setJournals(data.docs || []);
                setJournalTitles(data.journalTitle || '');
            } catch (error) {
                setFlashMessage('Error fetching journals');
                console.error('Error fetching journals:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserJournals();
    }, [user?.id, setFlashMessage]);

    /**
     * Creates a new journal
     * @param {string} title - The journal title
     * @returns {Promise<boolean>} - Success status
     */
    const createJournal = useCallback(async (title) => {
        if (!user?.id) {
            setFlashMessage('One moment please, we are verifying your account');
            return false;
        }

        if (title.trim() === '') {
            setFlashMessage('Journal title cannot be empty');
            return false;
        }

        try {
            // Don't set loading state during creation to avoid re-rendering entire grid
            const response = await axios.post(
                `http://localhost:5050/journals/createJournal`, 
                { title, userID: user.id }, 
                { withCredentials: true }
            );
            
            if (response.data) {
                setFlashMessage('Journal created successfully');
                setJournals(prevJournals => [...prevJournals, response.data]);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error creating journal:', error);
            setFlashMessage('Error creating journal');
            return false;
        }
    }, [user, setFlashMessage]);

    /**
     * Deletes a journal with user confirmation
     * @param {string} journalId - The ID of the journal to delete
     */
    const deleteJournal = useCallback((journalId) => {
        setDuration(7000);
        setFlashMessage(`Are you sure you want to delete that? This action cannot be undone.`);
        
        setToggleButton(true, 'Confirm Delete', async () => {
            try {
                const response = await axios.delete(
                    `http://localhost:5050/journals/journals/${journalId}`,
                    { withCredentials: true }
                );
                
                if (response.data.success) {
                    setJournals(prevJournals => 
                        prevJournals.filter(journal => journal._id !== journalId)
                    );
                    setDuration(3000);
                    setFlashMessage('Journal deleted successfully');
                } else {
                    setDuration(3000);
                    setFlashMessage('Could not delete journal, try again');
                }
            } catch (error) {
                console.error('Error deleting journal:', error);
                setDuration(3000);
                setFlashMessage('Error deleting journal');
            } finally {
                setToggleButton(false);
            }
        });
    }, [setFlashMessage, setToggleButton, setDuration]);

    const editJournal = useCallback(async (journalId, newTitle) => {
        try {
            const response = await axios.put("http://localhost:5050/journals/journals/" + journalId,
            { title: newTitle },
            { withCredentials: true });
            if (response.data) {
                setJournals(prevJournals => 
                    prevJournals.map(journal => journal._id === journalId ? response.data : journal)
                );
                setFlashMessage('Journal updated successfully');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating journal:', error);
            setFlashMessage('Error updating journal');
            return false;
        }
    }, [setFlashMessage]);

    return {
        journals,
        loading,
        createJournal,
        deleteJournal
    };
}
