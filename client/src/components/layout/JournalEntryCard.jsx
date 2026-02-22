import { useState } from "react";

//card that shows on JournalOverview to view older enties to be selected
export default function JournalEntryCard({ journalEntries, changeEntry }) {
  return (
    <div name="JournalEntryCard" className="grid-col-2">
      <div>
        {journalEntries.map((entry, index) => (
          <div
          onClick={changeEntry}
            className="border-2 my-3 border-blue-200 p-5 bg-linear-30 from-gray-500  to-gray-700 rounded-lg text-amber-100 text-center"
            key={index}
          >
            <p>Mood : {entry.mood}</p>
            <p>Date : {entry.dateCreated}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
