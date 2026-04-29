//card that shows on JournalOverview to view older enties to be selected
export default function JournalEntryCard({ journalEntries, changeEntry }) {
  return (
    <div name="JournalEntryCard" className="grid-col">
      <div>
        {journalEntries.map((entry, index) => (
          <div
            className="border-2 my-3 border-blue-200 p-5 bg-linear-30 from-gray-500  to-gray-700 rounded-lg text-amber-100 text-center hover:shadow-2xs hover:shadow-amber-100"
            key={index}
          >
            <p>{entry.pages?.[0]?.text?.slice(0, 20) ?? ""}...</p>

            <p>Mood : {entry.mood}</p>
            <p>Date : {entry.dateCreated}</p>
            <button
              onClick={() => changeEntry(entry)}
              className="relative top-5 border-blue-200 border-2 rounded-t-2xl py-2 px-12 bg-blue-200 text-black hover:text-white hover:bg-blue-300"
            >
              {" "}
              Edit / View{" "}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
