import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useJournals } from "../../hooks/useJournals";
import JournalEntryCard from "./JournalEntryCard";

//page to view a journals individual pages / entries

export default function JournalOverview() {
  const {
    journal,
    journalEntries,
    fetchSingleJournal,
    createEntry,
    editEntry,
    deleteEntry,
  } = useJournals();

  const { id } = useParams();

  const [createToEdit, setCreateToEdit] = useState(false);
  const [sideBarOpened, setSideBarOpen] = useState(false);
  const [showButtonOnScroll, setButtonOnScroll] = useState(false);

  const [pages, setPages] = useState([""]);
  const [pageImages, setPageImages] = useState([""]);
  const [openMoodPanel, setOpenMoodPanel] = useState(false);

  let currentPageIndex = 0;

  //mood is an enumeration that accepts - ['happy', 'sad', 'neutral', 'angry', 'excited']
  const [mood, setMood] = useState("neutral");

  const [activeEntrySelected, setActiveEntrySelected] = useState(pages || [""]);

  //payload for backend
  const JournalCreateEntryPayload = useCallback(() => {
    return {
      mood,
      pages: pages.map((pageText, index) => ({
        pageNumber: index + 1,
        text: pageText,
        images: pageImages[index] || [],
      })),
      journalId: journal._id,
    };
  }, [mood, pages, pageImages, journal._id]);

  const JournalEditEntryPayload = useCallback(() => {
    return {
      mood,
      pages: pages.map((pageText, index) => ({
        pageNumber: index + 1,
        text: pageText,
        images: pageImages[index] || [],
      })),
      journalEntryId: activeEntrySelected._id,
    };
  }, [mood, pages, pageImages, activeEntrySelected._id]);

  const JournalEntryDeletePayload = useCallback(() => {
    return {
      journalEntryId: activeEntrySelected._id,
    };
  }, [activeEntrySelected._id]);

  //fetch journal
  useEffect(() => {
    fetchSingleJournal(id);
  }, [id, sideBarOpened, fetchSingleJournal]);

  //handles listening for scroll to show back button if burried in content (entries) to be able to quickly go back in wanted
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 100 && sideBarOpened === true) {
        setButtonOnScroll(true);
      }
      setTimeout(() => {
        setButtonOnScroll(false);
      }, 3000);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sideBarOpened, showButtonOnScroll]);

  //change the entry from the indevidual entry card side panel
  const changeEntry = useCallback((entry) => {
    setActiveEntrySelected(entry);

    setPages(entry.pages.map((p) => p.text));

    setSideBarOpen(false);
    setCreateToEdit(true);
  }, []);

  //retreive journal from request query string / params
  //should set the navbar to close the mobile navigation and open the side panel on entry selection so it doesnt impede vision
  const openSideBar = () => {
    if (sideBarOpened) {
      setSideBarOpen(false);
    } else {
      setSideBarOpen(true);
    }
  };

  const handleChange = (e) => {
    const currentState = e.target.value;

    setPages((prev) =>
      prev.map((page, i) => (i === currentPageIndex ? currentState : page)),
    );
  };

  const handleMoodPanel = () => {
    if (openMoodPanel === false) {
      setOpenMoodPanel(true);
    } else {
      setOpenMoodPanel(false);
    }
  };

  //creation logic
  const handleCreateEntry = useCallback(() => {
    createEntry(JournalCreateEntryPayload());

    setPages([""]);
    setPageImages([""]);
    setMood("neutral");
  }, [createEntry, JournalCreateEntryPayload]);
  //edit logic
  const handleEditEntry = useCallback(() => {
    editEntry(JournalEditEntryPayload());
    setPages([""]);
    setPageImages([""]);
    setMood("neutral"); //placeholder in development still
    setCreateToEdit(false);
  }, [editEntry, JournalEditEntryPayload]);
  //delete logic
  const handledeleteEntry = useCallback(() => {
    deleteEntry(JournalEntryDeletePayload());
    setPages([""]);
    setPageImages([""]);
    setMood("neutral");
    setCreateToEdit(false);
  }, [deleteEntry, JournalEntryDeletePayload]);

  return (
    <div className="flex h-[calc(100vh-3rem)] justify-items-center overflow-hidden">
      <div
        name="EntrySidePanel"
        className={
          sideBarOpened
            ? `fixed flex flex-col space-y-1 inset-0 top-12 z-50 bg-gray-800 border-r-2 border-amber-100
           overflow-y-auto 
           md:static md:inset-auto md:top-0 md:w-1/2`
            : "hidden"
        }
      >
        <div name="entryGrid" className="mx-0 md:mx-2 w-full ">
          <JournalEntryCard
            journalEntries={journalEntries}
            changeEntry={changeEntry}
            deleteEntry={deleteEntry}
          />
        </div>
        <button
          onClick={openSideBar}
          className={`text-center text-lg lg:text-2xl bg-gray-600 text-blue-200 border  border-blue-200 p-4
             shadow-blue-100 shadow-2xs  max-h-16 rounded-t-lg hover:bg-gray-700 hover:text-blue-400 hover:border-blue-400
              hover:shadow-sm hover:shadow-amber-200 hover:cursor-grab ${showButtonOnScroll ? "fixed top-0 left-1/2" : " mt-auto"}`}
        >
          Back
        </button>
      </div>
      <div className="h-screen overflow-hidden bg-linear-to-r  from-gray-700 to-gray-900 w-full scrollbar-none">
        <div
          name="mainJournalingButtons"
          className="flex flex-row justiy-items-center justify-center"
        >
          {createToEdit ? (
            <>
              {" "}
              <button
                onClick={openSideBar}
                className="hidden sm:block text-center text-lg bg-gray-600 md:mx-2 text-blue-200 border border-blue-200 p-4
           shadow-amber-100 shadow-sm rounded-b-lg shrink hover:bg-gray-700 hover:text-blue-400
            hover:border-blue-400 hover:shadow-md hover:shadow-amber-200 hover:cursor-grab"
              >
                Entries
              </button>
              <button
                onClick={handleEditEntry}
                className="hidden sm:block text-center text-lg bg-gray-600 text-blue-200 border border-blue-200 p-4 md:mx-2
           shadow-amber-100 shadow-sm rounded-b-lg shrink  hover:bg-gray-700 hover:text-blue-400 
            hover:border-blue-400 hover:shadow-md hover:shadow-amber-200 hover:cursor-grab"
              >
                Save
              </button>
              <button
                className="hidden sm:block text-center text-lg lg:text-2xl bg-gray-600 md:mx-2 text-blue-200 border border-blue-200 p-4
           shadow-amber-100 shadow-sm rounded-b-lg shrink  hover:bg-gray-700 hover:text-blue-400
            hover:border-blue-400  hover:shadow-amber-200 hover:shadow-md hover:cursor-grab col-start-1 row-start-1 mt-auto"
                onClick={handleMoodPanel}
              >
                Mood
              </button>
              <button
                onClick={handledeleteEntry}
                className="hidden sm:block text-center text-lg bg-red-300 text-white border border-red-400 p-4 md:mx-2
           shadow-red-200 shadow-sm rounded-b-lg shrink hover:bg-red-400 hover:text-white
            hover:border-red-400 hover:shadow-md hover:shadow-red-200 hover:cursor-grab"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openSideBar}
                className="hidden sm:block text-center text-lg lg:text-2xl bg-gray-600 md:mx-2 text-blue-200 border border-blue-200 p-4
           shadow-amber-100 shadow-sm rounded-b-lg shrink  hover:bg-gray-700 hover:text-blue-400
            hover:border-blue-400  hover:shadow-amber-200 hover:shadow-md hover:cursor-grab col-start-1 row-start-1 mt-auto"
              >
                Entries
              </button>
              <button
                onClick={handleCreateEntry}
                className="hidden sm:block text-center text-lg lg:text-2xl bg-gray-600 md:mx-2 text-blue-200 border border-blue-200 p-4
           shadow-amber-100 shadow-sm rounded-b-lg shrink  hover:bg-gray-700 hover:text-blue-400
            hover:border-blue-400  hover:shadow-amber-200 hover:shadow-md hover:cursor-grab col-start-1 row-start-1 mt-auto"
              >
                Save
              </button>
              <button
                className="hidden sm:block text-center text-lg lg:text-2xl bg-gray-600 md:mx-2 text-blue-200 border border-blue-200 p-4
           shadow-amber-100 shadow-sm rounded-b-lg shrink  hover:bg-gray-700 hover:text-blue-400
            hover:border-blue-400  hover:shadow-amber-200 hover:shadow-md hover:cursor-grab col-start-1 row-start-1 mt-auto"
                onClick={handleMoodPanel}
              >
                Mood
              </button>
            </>
          )}
        </div>

        <div name="JournalEntry" className="h-7/8 grid">
          <textarea
            value={pages[currentPageIndex]}
            onChange={handleChange}
            inputMode="text"
            name="textInput"
            id="textInput"
            spellCheck={true}
            className={
              sideBarOpened
                ? "col-start-1 mb-4 row-start-1 border-2 border-amber-200 rounded-lg w-14/16 lg:w-7/8 lg:h-13/16 bg-linear-60 from-gray-700 to-gray-800 p-3 justify-self-center mt-2 md:mt-10  text-sm md:text-md lg:my-20 my-20 mx-8 text-amber-100 shadow-amber-200 shadow-md"
                : "col-start-1 row-start-1 border-2 border-amber-200  rounded-lg lg:w-5/8 lg:h-13/16 bg-linear-60 from-gray-700 to-gray-800 p-3 lg:mx-70 text-md md:mx-40 mt-10 md:mt-10 mb-20 mx-5 text-amber-100 shadow-amber-200 shadow-md"
            }
          ></textarea>
          {openMoodPanel ? (
            <div
              className="col-start-1 row-start-1 border-2 mb-22 rounded-lg mt-auto lg:mt-15 w-7/8 justify-self-center h-30
             bg-linear-180 from-gray-800 to-gray-900  border-blue-200 max-w-1/2 transition -translate-2"
            ></div>
          ) : (
            ""
          )}

          <section className="col-start-1 row-start-1 mt-auto space-x-2 justify-self-center">
            {" "}
            <button
              className="sm:hidden col-start-1 mt-auto row-start-1 max-w-30 max-h-20 py-4 border-2 border-blue-200 rounded-lg hover:shadow-amber-100 hover:shadow-md
             px-6 text-blue-200 hover:text-blue-400 hover:cursor-grab bg-gray-600"
              onClick={handleMoodPanel}
            >
              Mood
            </button>
            <button
              onClick={openSideBar}
              className="sm:hidden col-start-1 mt-auto row-start-1 max-w-30 max-h-20 border-2 border-blue-200 rounded-lg hover:shadow-amber-100 hover:shadow-md
            py-4 px-6 text-blue-200 hover:text-blue-400 hover:cursor-grab bg-gray-600"
            >
              Entries
            </button>
            <button
              onClick={handleCreateEntry}
              className="sm:hidden col-start-1 mt-auto row-start-1 max-w-30 max-h-20 border-2 border-blue-200 rounded-lg hover:shadow-amber-100 hover:shadow-md
            py-4 px-6 text-blue-200 hover:text-blue-400 hover:cursor-grab bg-gray-600"
            >
              Save
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
