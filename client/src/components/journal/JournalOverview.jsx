import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useJournals } from "../../hooks/useJournals";
import JournalEntryCard from "../layout/JournalEntryCard";

//page to view a journals individual pages / entries

export default function JournalOverview() {
  const { loading, journal, journalEntries, fetchSingleJournal, createEntry } =
    useJournals();

  const { id } = useParams();

  const [sideBarOpened, setSideBarOpen] = useState(false);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pages, setPages] = useState(journal.pages || [""]);
  const [pageImages, setPageImages] = [""];

  //mood is an enumeration that accepts - ['happy', 'sad', 'neutral', 'angry', 'excited']
  const [mood, setMood] = useState("neutral");

  //payload for backend
  const JournalEntryPayload = {
    mood,
    pages: pages.map((pageText, index) => ({
      pageNumber: index + 1,
      text: pageText,
      images: pageImages[index] || [],
    })),
    journalId: journal._id,
  };

  //fetch journal
  useEffect(() => {
    fetchSingleJournal(id);
  }, [id, journalEntries]);


  const changeEntry = useCallback(()=> {
    
  }, [pages])
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

  const handlePageChangeUp = useCallback(() => {
    if (currentPageIndex < 10) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  }, [currentPageIndex]);
  const handlePageChangeDown = useCallback(() => {
    setCurrentPageIndex((prev) => prev - 1);
  }, [currentPageIndex]);

  //creation logic
  const handleCreateEntry = useCallback(() => {
    createEntry(JournalEntryPayload);
    setPages([""]);
    setPageImages([""]);
    setCurrentPageIndex(0);
    setMood("neutral");
  }, [createEntry, pages, mood, journal._id]);

  return (
    <div className="flex">
      <div
        name="EntryPanelSide"
        className={
          sideBarOpened
            ? `fixed inset-0 top-12 z-50 bg-gray-800 border-2 border-r-amber-100
               md:static md:inset-auto md:top-0 md:w-1/2 `
            : "hidden"
        }
      >
        <div name='entryGrid' className="grid-cols-2">
          <JournalEntryCard journalEntries={journalEntries} changeEntry={changeEntry}/>
        </div>
        <button
          onClick={openSideBar}
          className="text-center text-2xl bg-gray-600 text-blue-200 border md:left-0 border-blue-200 p-4 shadow-blue-100 shadow-2xs rounded-t-lg fixed bottom-0 left-5/12 hover:bg-gray-700 hover:text-blue-400 hover:border-blue-400 hover:shadow-sm hover:shadow-amber-200 hover:cursor-grab"
        >
          Back
        </button>
      </div>
      <div className="h-svh lg:h-lvh bg-linear-to-r from-gray-700 to-gray-900 w-full">
        <button
          onClick={openSideBar}
          className="text-center text-2xl bg-gray-600 mx-2 text-blue-200 border border-blue-200 p-4
           shadow-blue-100 shadow-2xs rounded-b-lg relative left-1/8 z-10 hover:bg-gray-700 hover:text-blue-400
            hover:border-blue-400 hover:shadow-sm hover:shadow-amber-200 hover:cursor-grab"
        >
          Entries
        </button>
        <button
          onClick={handleCreateEntry}
          className="text-center text-2xl bg-gray-600 text-blue-200 border border-blue-200 p-4 mx-2
           shadow-blue-100 shadow-2xs rounded-b-lg relative left-1/8 z-10 hover:bg-gray-700 hover:text-blue-400
            hover:border-blue-400 hover:shadow-sm hover:shadow-amber-200 hover:cursor-grab"
        >
          Save
        </button>
        <div name="pageChangeButtons">
          {currentPageIndex === 0 ? null : (
            <button
              onClick={handlePageChangeUp}
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
        </div>

        <div name="JournalEntry" className="flex h-7/8">
          <textarea
            value={pages[currentPageIndex]}
            onChange={handleChange}
            inputMode="text"
            name="textInput"
            id="textinput"
            className={
              sideBarOpened
                ? "border-2 border-amber-100 rounded-lg w-14/16 lg:w-7/8 lg:h-13/16 bg-neutral-300 p-3 justify-self-center lg:my-20 my-20 mx-8"
                : "border-2 border-amber-100 rounded-lg w-14/16 lg:w-5/8 lg:h-13/16 bg-neutral-300 p-3 ml-auto lg:mx-70 md:mx-40 sm:mx-10 lg:my-20 my-20 mx-8 "
            }
          ></textarea>
        </div>
      </div>
    </div>
  );
}
