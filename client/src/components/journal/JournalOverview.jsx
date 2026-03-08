import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useJournals } from "../../hooks/useJournals";
import JournalEntryCard from "../layout/JournalEntryCard";

//page to view a journals individual pages / entries

export default function JournalOverview() {
  const {
    loading,
    journal,
    journalEntries,
    fetchSingleJournal,
    createEntry,
    editEntry,
  } = useJournals();

  const { id } = useParams();

  const [createToEdit, setCreateToEdit] = useState(false);
  const [sideBarOpened, setSideBarOpen] = useState(false);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pages, setPages] = useState([""]);
  const [pageImages, setPageImages] = useState([""]);

  //mood is an enumeration that accepts - ['happy', 'sad', 'neutral', 'angry', 'excited']
  const [mood, setMood] = useState("neutral");

  const [activeEntrySelected, setActiveEntrySelected] = useState(pages || [""]);

  //payload for backend
  const JournalCreateEntryPayload = {
    mood,
    pages: pages.map((pageText, index) => ({
      pageNumber: index + 1,
      text: pageText,
      images: pageImages[index] || [],
    })),
    journalId: journal._id,
  };

  const JournalEditEntryPayload = {
    mood,
    pages: pages.map((pageText, index) => ({
      pageNumber: index + 1,
      text: pageText,
      images: pageImages[index] || [],
    })),
    journalEntryId: activeEntrySelected._id,
  };

  //fetch journal
  useEffect(() => {
    fetchSingleJournal(id);
  }, [id, sideBarOpened]);

  //change the entry from the indevidual entry card side panel
  const changeEntry = useCallback((entry) => {
    setActiveEntrySelected(entry);
    console.log("triggered!");

    setPages(entry.pages.map((p) => p.text));

    setSideBarOpen(false);
    setCreateToEdit(true);
  }, []);

  //retreive journal from request query string / params

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

  //for page increment and decrement if used later
  // const handlePageChangeUp = useCallback(() => {
  //   setCurrentPageIndex(prev => Math.min(prev + 1, 10));
  // }, []);

  // const handlePageChangeDown = useCallback(() => {
  //   setCurrentPageIndex(prev => Math.max(prev - 1, 0));
  // }, []);

  //creation logic
  const handleCreateEntry = useCallback(() => {
    createEntry(JournalCreateEntryPayload);
    setPages([""]);
    setPageImages([""]);
    setMood("neutral");
  }, [createEntry, pages, mood, journal._id]);
  //edit logic
  const handleEditEntry = useCallback(() => {
    editEntry(JournalEditEntryPayload);
    setPages([""]);
    setPageImages([""]);
    setMood("neutral"); //placeholder in development still
    setCreateToEdit(false);
  }, [editEntry, pages, mood, journal._id]);

  return (
    <div className="flex h-[calc(100vh-3rem)] overflow-hidden">
      <div
        name="EntryPanelSide"
        className={
          sideBarOpened
            ? `fixed inset-0 top-12 z-50 bg-gray-800 border-r-2 border-amber-100
           overflow-y-auto
           md:static md:inset-auto md:top-0 md:w-1/2`
            : "hidden"
        }
      >
        <div name="entryGrid" className="grid-cols-2 mx-3">
          <JournalEntryCard
            journalEntries={journalEntries}
            changeEntry={changeEntry}
          />
        </div>
        <button
          onClick={openSideBar}
          className="text-center text-2xl bg-gray-600 text-blue-200 border md:left-0 border-blue-200 p-4 shadow-blue-100 shadow-2xs rounded-t-lg fixed bottom-0 left-5/12 hover:bg-gray-700 hover:text-blue-400 hover:border-blue-400 hover:shadow-sm hover:shadow-amber-200 hover:cursor-grab"
        >
          Back
        </button>
      </div>
      <div className="h-screen overflow-hidden bg-linear-to-r  from-gray-700 to-gray-900 w-full scrollbar-none">
        <div name="mainJournalingButtons" className="">
          {createToEdit ? (
            <>
              {" "}
              <button
                onClick={openSideBar}
                className="text-center text-2xl bg-gray-600 md:mx-2 text-blue-200 border border-blue-200 p-4
           shadow-blue-100 shadow-2xs rounded-b-lg relative lg:left-1/8 md:left-2/8 sm:left-3/8 left-10 z-10 hover:bg-gray-700 hover:text-blue-400
            hover:border-blue-400 hover:shadow-sm hover:shadow-amber-200 hover:cursor-grab"
              >
                Entries
              </button>
              <button
                onClick={handleEditEntry}
                className="text-center text-2xl bg-gray-600 text-blue-200 border border-blue-200 p-4 md:mx-2
           shadow-blue-100 shadow-2xs rounded-b-lg relative lg:left-1/8 md:left-2/8 sm:left-3/8 left-15 z-10 hover:bg-gray-700 hover:text-blue-400
            hover:border-blue-400 hover:shadow-sm hover:shadow-amber-200 hover:cursor-grab"
              >
                Edit
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openSideBar}
                className="text-center text-2xl bg-gray-600 md:mx-2 text-blue-200 border border-blue-200 p-4
           shadow-blue-100 shadow-2xs rounded-b-lg relative lg:left-1/8 md:left-2/8 sm:left-3/8 left-10 z-10 hover:bg-gray-700 hover:text-blue-400
            hover:border-blue-400 hover:shadow-sm hover:shadow-amber-200 hover:cursor-grab"
              >
                Entries
              </button>
              <button
                onClick={handleCreateEntry}
                className="text-center text-2xl bg-gray-600 text-blue-200 border border-blue-200 p-4 md:mx-2
           shadow-blue-100 shadow-2xs rounded-b-lg relative lg:left-1/8 md:left-2/8 sm:left-3/8 left-15 z-10 hover:bg-gray-700 hover:text-blue-400
            hover:border-blue-400 hover:shadow-sm hover:shadow-amber-200 hover:cursor-grab"
              >
                Save
              </button>
            </>
          )}
        </div>
        {/* if page incrementation and decremention is needed or wanted later */}
        {/* <div name="pageChangeButtons">
          {currentPageIndex === 0 ? <></> : (
            <button
              onClick={}
              className="text-center text-2xl bg-gray-600 text-blue-200 border border-blue-200 p-2 mx-2
           shadow-blue-100 shadow-2xs rounded-lg fixed z-10 bottom-1/2  hover:bg-gray-700 hover:text-blue-400
            hover:border-blue-400 hover:shadow-sm hover:shadow-amber-200 hover:cursor-grab"
            >
              {" "}
              &#8592;{" "}
            </button>
          )}
          <button
            onClick={handlePageChangeDown}
            className="text-center text-2xl bg-gray-600 text-blue-200 border border-blue-200 p-2 mx-2
           shadow-blue-100 shadow-2xs rounded-lg fixed z-10 bottom-1/2 right-1  hover:bg-gray-700 hover:text-blue-400
            hover:border-blue-400 hover:shadow-sm hover:shadow-amber-200 hover:cursor-grab"
          >
            {" "}
            &#8594;{" "}
          </button>
        </div> */}

        <div name="JournalEntry" className="flex h-7/8">
          <textarea
            value={pages[currentPageIndex]}
            onChange={handleChange}
            inputMode="text"
            name="textInput"
            id="textInput"
            className={
              sideBarOpened
                ? "border-2 border-amber-100 rounded-lg w-14/16 lg:w-7/8 lg:h-13/16 bg-neutral-300 p-3 justify-self-center lg:my-20 my-20 mx-8"
                : "border-2 border-amber-100 rounded-lg w-14/16 lg:w-5/8 lg:h-13/16 bg-neutral-300 p-3 lg:mx-70 md:mx-40 mt-10 mb-20 mx-5"
            }
          ></textarea>
        </div>
      </div>
    </div>
  );
}
