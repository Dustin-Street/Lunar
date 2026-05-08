import { useState, useCallback, useEffect } from "react";
import LunarButton from "../layout/LunarButton";
import HoverButton from "../layout/HoverButton";
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
      setTimeout(() => {
        setShowError(false);
      }, 3000);
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

  const cancelCreate = () => {
    setCollapsed(true);
  };

  return (
    <div className="flex-row items-center">
      {collapsed ? (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <button
            className="hover:shadow-2xl hover:shadow-amber-100 hover:border-amber-100 hover:-translate-1 border-4 text-white text-shadow-black font-medium border-blue-200 bg-linear-60 from-blue-600  to-blue-200 rounded-2xl mt-8 p-4 text-lg hover:bg-linear hover:from-blue-200 hover:to-blue-600"
            onClick={() => {
              setCollapsed(false);
            }}
          >
            Create journal
          </button>
        </div>
      ) : (
        <div
          className={`flex relative place-items-center group border-4 bg-opacity-75
             border-blue-200 px-12 py-48 bg-linear-90 from-gray-700 to-gray-900 items-center max-w-80 max-h-60
             text-amber-100 font-medium rounded-lg  hover:shadow-2xl
             hover:shadow-blue-400 transition-shadow m-0 ${className} `}
        >
          <div
            name="interactionButtons"
            className="md:group-hover:opacity-100 md:opacity-10 transition-opacity duration-2200 ease-out group-hover:duration-300 group-hover:ease-in"
          >
            <h3 className="relative justify-self-center mb-auto text-lg sm:text-xl">
              Create Journal
            </h3>

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
                    bg-neutral-100 rounded-lg px-2  py-2 text-black text-center w-full max-w-full
                     outline-none transition-all duration-300 shrink justify-self-center my-12
                    ${
                      showError
                        ? "border-4 border-red-400 animate-pulse"
                        : "border-2 border-transparent focus:border-blue-400"
                    }
                `}
            />
            {showError ? (
              <p className="animate-pulse text-sm text-red-400 justify-self-center m-0">
                {" "}
                title cannot be empty
              </p>
            ) : null}
            <HoverButton
              position="left"
              colorBefore="blue-200"
              colorAfter="gray-600"
              buttonText="Create"
              onClick={handleSubmit}
            />
            <HoverButton
              position="right"
              colorBefore="gray-600"
              colorAfter="white"
              buttonText="Cancel"
              onClick={cancelCreate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
