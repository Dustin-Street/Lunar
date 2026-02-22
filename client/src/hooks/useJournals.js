import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../components/context/AuthContext";
import { useFlashMessage } from "../components/context/FlashMessageContext";
import { Navigate, useNavigate } from "react-router-dom";

/**
 * Custom hook for managing journal-related state and operations
 * Encapsulates all journal CRUD operations and data fetching logic
 */
export function useJournals() {
  //many journals
  const [journals, setJournals] = useState([]);

  //single journal call
  const [journal, setJournal] = useState({});
  const [journalEntries, setJournalEntries] = useState([]);

  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { setFlashMessage, setToggleButton, setDuration } = useFlashMessage();

  const navigate = useNavigate();

  // Fetch journals when user is available
  useEffect(() => {
    if (!user?.id) {
      setFlashMessage("One moment please, we are verifying your account...");
      return;
    }

    async function fetchUserJournals() {
      const userID = user.id;
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5050/journals/journalSelect/${userID}`,
          {
            withCredentials: true,
          },
        );
        const data = response.data;
        setJournals(data.docs || []);
      } catch (error) {
        setFlashMessage("Error fetching journals");
        console.error("Error fetching journals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserJournals();
  }, [user?.id, setFlashMessage]);

  //if authenticated return a individual journal

  const fetchSingleJournal = useCallback(
    async (journalId) => {
      console.log("Fetching journal with ID:", journalId);
      if (!user?.id) {
        setFlashMessage("One moment please, we are verifying your account...");
        setTimeout(() => {
          navigate("/")(
            setFlashMessage(
              "Redirected because account could not be verified for account safety",
            ),
          );
        }, 3000);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5050/journals/JournalOverview/${journalId}`,
          {
            withCredentials: true,
          },
        );
        const data = response.data;
        setJournal(data.docs || {});
        setJournalEntries(data.results || []);
      } catch (error) {
        setFlashMessage("Error fetching journal");
        console.error("Error fetching journal : ", error);
      } finally {
        setLoading(false);
      }
    },
    [user, setFlashMessage],
  );

  /**
   * Creates a new journal
   * @param {string} title - The journal title
   * @returns {Promise<boolean>} - Success status
   */
  const createJournal = useCallback(
    async (title) => {
      if (!user?.id) {
        setFlashMessage("One moment please, we are verifying your account...");
        setTimeout(() => {
          navigate("/")(
            setFlashMessage(
              "Redirected because account could not be verified for account safety",
            ),
          );
        }, 3000);
        return;
      }

      if (title.trim() === "") {
        setFlashMessage("Journal title cannot be empty");
        return false;
      }

      try {
        // Don't set loading state during creation to avoid re-rendering entire grid
        const response = await axios.post(
          `http://localhost:5050/journals/createJournal`,
          { title, userID: user.id },
          { withCredentials: true },
        );

        if (response.data) {
          setFlashMessage("Journal created successfully");
          setJournals((prevJournals) => [...prevJournals, response.data]);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error creating journal:", error);
        setFlashMessage("Error creating journal");
        return false;
      }
    },
    [user, setFlashMessage],
  );

  /**
   * Creates a new journal
   * @param {string} content - content of the indevidual pages
   * @param {string} userID - The user Id assosiated with the journal at creation
   * @param {string} journalId - the journal id assosiated with the entry at creation queried from the query string req.param
   * @returns {Promise<boolean>} - Success status
   */
  const createEntry = useCallback(
    async (pages, mood, journalId) => {
      console.log(pages, mood, journalId);

      //handle if user is no longer authorized
      if (!user?.id) {
        setFlashMessage("One moment please, we are verifying your account...");
        setTimeout(() => {
          navigate("/")(
            setFlashMessage(
              "Redirected because account could not be verified for account safety",
            ),
          );
        }, 3000);
        return;
      }

      console.log("cleared auth");
      try {
        console.log("in try block start");

        const response = await axios.post(
          `http://localhost:5050/journals/createEntry`,
          { pages: pages, mood: mood, userID: user.id, journalId: journalId },
          { withCredentials: true },
        );

        if (response.data) {
          console.log(response.data);
          setFlashMessage("Entry added successfully");
          setJournalEntries((prevEntries) => [...prevEntries, response.data]);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error updating Entry:", error);
        setFlashMessage("Error updating Entry");
        return false;
      }
    },
    [user, setFlashMessage],
  );

  /**
   * Deletes a journal with user confirmation
   * @param {string} journalId - The ID of the journal to delete
   */
  const deleteJournal = useCallback(
    (journalId) => {
      setDuration(7000);
      setFlashMessage(
        `Are you sure you want to delete that? This action cannot be undone.`,
      );

      setToggleButton(true, "Confirm Delete", async () => {
        try {
          const response = await axios.delete(
            `http://localhost:5050/journals/${journalId}`,
            { withCredentials: true },
          );

          if (response.data.success) {
            setJournals((prevJournals) =>
              prevJournals.filter((journal) => journal._id !== journalId),
            );
            setDuration(3000);
            setFlashMessage("Journal deleted successfully");
          } else {
            setDuration(3000);
            setFlashMessage("Could not delete journal, try again");
          }
        } catch (error) {
          console.error("Error deleting journal:", error);
          setDuration(3000);
          setFlashMessage("Error deleting journal");
        } finally {
          setToggleButton(false);
        }
      });
    },
    [setFlashMessage, setToggleButton, setDuration],
  );

  /**
   * @param {string} journalId - the ID of the journal to edit
   * @param {string} newTitle - the new journal title to replace the old title
   */

  const editJournal = useCallback(
    async (journalId, newTitle) => {
      try {
        setFlashMessage(`Changing to ${newTitle}`);
        const response = await axios.put(
          `http://localhost:5050/journals/${journalId}`,
          { title: newTitle },
          { withCredentials: true },
        );
        if (response.data) {
          setJournals((prevJournals) =>
            prevJournals.map((journal) =>
              journal._id === journalId ? response.data : journal,
            ),
          );
          setFlashMessage(`Journal updated successfully`, 3000);
          setToggleButton(false);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error updating journal:", error);
        setFlashMessage("Error updating journal");
        return false;
      }
    },
    [setFlashMessage],
  );

  /**
   * @param {string} journalId - the ID of the journal to edit
   * @param {string} newImage - the new journal background Image to replace the old background Image
   */

  //expects a string can be a Hex code as well to be stored in DB
  const uploadImage = useCallback(
    async (journalId, newBackground, method) => {
      //schema expects type : String enum ['Url' , 'Hex'], Value : 'url or hex value'
      try {
        const response = await axios.put(
          `http://localhost:5050/journals/${journalId}`,
          { type: method, value: newBackground },
          { withCredentials: true },
        );
        if (response.data) {
          setJournals((prevJournals) =>
            prevJournals.map((journal) =>
              journal._id === journalId ? response.data : journal,
            ),
          );
          setFlashMessage("Background Successfully Changed", 3000);
          setToggleButton(false);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error updating background");
        setFlashMessage(
          `Error updating journal, Supported types : PNG - JPG file size limit of 10MB`,
        );
        return false;
      }
    },
    [setFlashMessage],
  );

  return {
    journals,
    journal,
    journalEntries,
    loading,
    createJournal,
    deleteJournal,
    editJournal,
    uploadImage,
    fetchSingleJournal,
    createEntry,
  };
}
