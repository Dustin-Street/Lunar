import { useState, useEffect } from "react";
import JournalCard from "./JournalCard";
import JournalCreateCard from "./JournalCreateCard";

/**
 * Grid layout component that displays all journals plus create form
 * Handles the responsive grid layout
 */
export default function JournalGrid({
  journals,
  Delete,
  Edit,
  Create,
  Upload,
}) {
  const [createCollapsed, setCollapse] = useState(false);

  useEffect(() => {
    function manageCollapse() {
      if (journals.length > 0) {
        setCollapse(true);
      } else {
        setCollapse(false);
      }
    }
    manageCollapse();
  }, [journals]);

  return (
    //passing down from Journal Select -> journalCard
    <div>
      <img
        src="/images/journaldeepnight2.webp"
        alt=""
        className="hidden"
        fetchPriority="high"
      />
      <div
        className={`fixed inset-0 bg-[url('/images/journaldeepnight2.webp')] bg-cover bg-center bg-no-repeat ${createCollapsed ? "" : null}`}
      >
        {!createCollapsed && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 pointer-events-auto"></div>
        )}

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 place-items-center px-6 py-10 gap-3 overflow-y-auto h-screen">
          {journals.map((journal) => (
            <JournalCard
              key={journal._id}
              journal={journal}
              onDelete={Delete}
              onEdit={Edit}
              onImageUpload={Upload}
              className={"mt-6"}
            />
          ))}
        </div>
        <JournalCreateCard
          onSubmit={Create}
          className="sm:min-w-80 min-w-80"
          journals={journals}
          createCollapsed={createCollapsed}
          setCollapse={setCollapse}
        />
      </div>
    </div>
  );
}
