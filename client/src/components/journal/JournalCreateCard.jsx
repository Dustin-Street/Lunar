import { useState, useCallback, useEffect } from "react";
import LunarButton from "../layout/LunarButton";
/**
 * Reusable form component for creating new journals
 * Handles its own title state and validation
 */
export default function JournalCreateCard({
  onSubmit,
  className = "",
  journals,
}) {
  const [title, setTitle] = useState("");
  const [showError, setShowError] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  console.log(journals);
  useEffect(() => {
    function manageCollapse() {
      if (journals.length > 0) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    }
    manageCollapse();
  }, [journals]);

  // Memoize submit handler to prevent recreation on every render
  const handleSubmit = useCallback(async () => {
    if (title.trim() === "") {
      setShowError(true);
      return;
    }

    const success = await onSubmit(title);
    if (success) {
      setTitle(""); // Clear form on success
      setShowError(false);
    } else {
      setShowError(true);
    }
  }, [title, onSubmit]);

  // Handle Enter key within form context only
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  const callpsedCreateCard = () => {
    return;
  };
  return (
    <>
      {collapsed ? (
        <div className="absolute top-4 z-20">
          <button
            className="border-4 border-blue-200 bg-linear-60 from-blue-400  to-blue-200 rounded-b-2xl mt-8 p-4 text-lg text-white hover:bg-linear hover:from-blue-400 hover:to-blue-600"
            onClick={() => {
              setCollapsed(false);
            }}
          >
            Create journal
          </button>
        </div>
      ) : (
        <div
          className={`flex-col shrink text-center place-items-center group border-4 border-blue-200 bg-linear-to-r mt-8 from-gray-600 py-40 via-gray-700 to-gray-900 mx-0  text-amber-100 w-full max-h-sm min-w-65 max-w-xs lg:max-w-sm my-0 font-medium rounded-lg ${className}`}
        >
          <input
            name="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setShowError(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Journal Title"
            className={`
                    bg-neutral-100 rounded-lg m-0 px-4  py-2 text-black text-center 
                     outline-none transition-all duration-300 shrink
                    ${
                      showError
                        ? "border-4 border-red-400 animate-pulse"
                        : "border-2 border-transparent focus:border-blue-400"
                    }
                `}
          />
          <h3 className="mb-6 text-lg sm:text-xl">Create New Journal</h3>
          <button onClick={handleSubmit} className="flex flex-col items-center">
            <svg
              className="border-transparent hover:border-blue-400 hover:border-4 shadow-2xl shadow-blue-400 rounded-3xl w-16 h-16 sm:w-20 sm:h-20 md:w-25 md:h-25 group-hover:text-blue-300 text-blue-200 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
