import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../components/context/AuthContext";
import { useFlashMessage } from "../components/context/FlashMessageContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import logger from "../utils/logger";

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

  const [loading, setLoading] = useState(false);
  const { user, accessToken } = useAuth();
  const { setFlashMessage, setToggleButton, setDuration } = useFlashMessage();

  const navigate = useNavigate();

  // Fetch journals when user is available
  useEffect(() => {
    if (!user?._id) {
      setFlashMessage("One moment please, we are verifying your account...");
      setLoading(false);
      return;
    }

    async function fetchUserJournals() {
      const userID = user._id;
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/journals/journalSelect/${userID}`,
          {
            withCredentials: true,
            timeout: 10000,
          },
        );
        const data = response.data;
        setJournals(data.docs || []);
      } catch (error) {
        logger.error("Error fetching journals:", error);
        setFlashMessage("Error fetching journals");
      } finally {
        setLoading(false);
      }
    }

    fetchUserJournals();
  }, [user?._id, accessToken, setFlashMessage]);

  //if authenticated return a individual journal

  const fetchSingleJournal = useCallback(
    async (journalId) => {
      if (!user?._id) {
        setFlashMessage("One moment please, we are verifying your account...");
        setTimeout(() => {
          navigate("/");
          (logger(info, "user redirected due to unauthorized"),
            setFlashMessage(
              "Redirected because account could not be verified for account safety",
            ));
          setLoading(false);
        }, 3000);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/journals/JournalOverview/${journalId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data = response.data;
        setJournal(data.journal);

        setJournalEntries(data.entries?.docs);
      } catch (error) {
        setFlashMessage("Error fetching journal");
        console.error("Error fetching journal : ", error);
      } finally {
        setLoading(false);
      }
    },
    [user, accessToken, setFlashMessage],
  );

  /**
   * Creates a new journal
   * @param {string} title - The journal title
   * @returns {Promise<boolean>} - Success status
   */
  const createJournal = useCallback(
    async (title) => {
      if (!user?._id) {
        setFlashMessage("One moment please, we are verifying your account...");
        setTimeout(() => {
          navigate("/");
          setFlashMessage(
            "Redirected because account could not be verified for account safety",
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
          `${API_BASE_URL}/journals/createJournal`,
          { title, userID: user._id },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
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
    [user, accessToken, setFlashMessage],
  );

  /**
   * Creates a new journal Entry
   * @param {string} content - content of the indevidual pages
   * @param {string} userID - The user Id assosiated with the journal at creation
   * @param {string} journalId - the journal id assosiated with the entry at creation queried from the query string req.param
   * @returns {Promise<boolean>} - Success status
   */
  const createEntry = useCallback(
    async ({ mood, pages, journalId }) => {
      if (!user?._id) {
        setFlashMessage("One moment please, we are verifying your account...");
        setTimeout(() => {
          navigate("/");
          setFlashMessage(
            "Redirected because account could not be verified for account safety",
          );
        }, 3000);
        return;
      }

      if (!pages || pages.length === 0) {
        setFlashMessage("Entry must have at least one page!");
        return false;
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/journals/createEntry`,
          {
            mood: mood,
            pages: pages,
            journalId: journalId,
            userID: user._id,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.data) {
          setFlashMessage("Entry added successfully");
          setJournalEntries((prev) =>
            Array.isArray(prev) ? [...prev, response.data] : [response.data],
          );
          return true;
        }

        return false;
      } catch (error) {
        console.error("Error creating entry:", error);
        setFlashMessage("Error creating entry");
        return false;
      }
    },
    [user, accessToken, setFlashMessage],
  );

  /**
   * edit a journal entry
   * @param {string} content - content of the indevidual pages
   * @param {string} userID - The user Id assosiated with the journal at creation
   * @param {string} journalId - the journal id assosiated with the entry at creation queried from the query string req.param
   * @returns {Promise<boolean>} - Success status
   */
  const editEntry = useCallback(
    async ({ mood, pages, journalEntryId }) => {
      if (!user?._id) {
        setFlashMessage("One moment please, we are verifying your account...");
        setTimeout(() => {
          navigate("/");
          setFlashMessage(
            "Redirected because account could not be verified for account safety",
          );
        }, 3000);
        return;
      }

      if (!pages || pages.length === 0) {
        setFlashMessage("Entry must have at least one page!");
        return false;
      }

      try {
        const response = await axios.put(
          `${API_BASE_URL}/journals/editEntry`,
          {
            mood: mood,
            pages: pages,
            journalEntryId: journalEntryId,
            userID: user._id,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.data) {
          setFlashMessage("Entry edit successful");
          setJournalEntries((prev) =>
            Array.isArray(prev) ? [...prev, response.data] : [response.data],
          );
          return true;
        }

        return false;
      } catch (error) {
        console.error("Error editting entry:", error);
        setFlashMessage("Error editting entry");
        return false;
      }
    },
    [user, accessToken, setFlashMessage],
  );

  const deleteEntry = useCallback(
    async ({ journalEntryId }) => {
      if (!user?._id) {
        setFlashMessage("One moment please, we are verifying your account...");
        setTimeout(() => {
          navigate("/");
          setFlashMessage(
            "Redirected because account could not be verified for account safety",
          );
        }, 3000);
        return;
      }

      try {
        const response = await axios.delete(
          `${API_BASE_URL}/journals/deleteEntry/${journalEntryId}`,
          {
            data: { userID: user._id },
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.data) {
          setFlashMessage("Entry deleted successfully");
          setJournalEntries((prev) =>
            Array.isArray(prev)
              ? prev.filter((entry) => entry._id !== journalEntryId)
              : [],
          );
          return true;
        }

        return false;
      } catch (error) {
        console.error("Error deleting entry:", error);
        setFlashMessage("Error deleting entry");
        return false;
      }
    },
    [user, accessToken, setFlashMessage],
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
            `${API_BASE_URL}/journals/${journalId}`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
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
    [setFlashMessage, setToggleButton, setDuration, accessToken],
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
          `${API_BASE_URL}/journals/${journalId}`,
          { title: newTitle },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
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
    [setFlashMessage, accessToken],
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
          `${API_BASE_URL}/journals/${journalId}`,
          { type: method, value: newBackground },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
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
    editEntry,
    deleteEntry,
  };
}
