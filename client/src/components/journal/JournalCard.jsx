import { useCallback, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useFilePicker } from "use-file-picker";
import { useFlashMessage } from "../context/FlashMessageContext";
import HoverButton from "../layout/HoverButton";

/**
 * Individual journal card component
 * Displays a single journal with edit and delete actions
 * Memorized to prevent re-renders when other journals update
 */
function JournalCard({ journal, onDelete, onEdit, onImageUpload }) {
  const { setFlashMessage, setToggleButton, setDuration } = useFlashMessage();
  //journal customization settings
  const [journalBackground, setJournalBackground] = useState("");

  //main edit state
  const [InEdit, setInEdit] = useState(false);
  const [showError, setShowError] = useState(false);
  const [title, setTitle] = useState("");

  //customization elements that can be editted by change background button click
  const [inChangeBackground, setInChangeBackground] = useState(false);
  const [inChangeBackgroundImage, setInChangeBackgroundImage] = useState(false);
  const [inChangeBackgroundColor, setInChangeBackgroundColor] = useState(false);
  const [image, setImage] = useState("");
  const [border, setborder] = useState("");

  const { filesContent, errors, openFilePicker, loading } = useFilePicker({
    accept: ".jpg,.png,.pdf", // Specify allowed file types
    multiple: false, // Allow multiple file selection
    onFilesSuccessfullySelected: ({ filesContent }) => {
      handleBackgroundChangeImage(filesContent);
    },
    onFilesRejected : ({}) =>{
        setFlashMessage('Image upload failed, try again')
    }
  });

  const navigate = useNavigate();

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleEdit();
    }
  };

  // Memoize callbacks to prevent recreation
  const handleDelete = useCallback(() => {
    onDelete(journal._id);
  }, [onDelete, journal._id]);

  //go into edit state on first edit button click
  const handleEditState = useCallback(() => {
    setTitle(journal.title);
    setInEdit(true);
  }, [journal.title]);

  //leave edit state on cancel click
  const handleLeaveEditState = useCallback(() => {
    setInEdit(false);
    setInChangeBackground(false);
    setInChangeBackgroundColor(false);
    setInChangeBackgroundImage(false);
    setTitle(journal.title);
  });

  const handleEdit = useCallback(() => {
    if (title.trim() === "") {
      setShowError(true);

      return;
    }
    onEdit(journal._id, title);
    setInEdit(false);
    setInChangeBackground(false);
    setShowError(false);
  }, [onEdit, journal._id, title]);

  const handleNavigate = useCallback(() => {
    navigate(`/journalOverview/${journal._id}`);
  }, [navigate, journal._id]);

  //background
  const handleBackgroundState = useCallback(() => {
    setInChangeBackground(true);
  });

  //logic to upload an image as background
  const handleBackgroundChangeImage = useCallback(
    (newImage) => {
      //expected in backend - type : enum ['Hex','Url'] - value : 'hex string or Url string'
      onImageUpload(journal._id, "Url", newImage);
      setInEdit(false);
      setInChangeBackground(false);
      setInChangeBackgroundImage(false);
    },
    [onImageUpload, journal._id],
  );

  const enterChangeBackgroundImage = useCallback(() => {
    setInChangeBackgroundImage(true);
    openFilePicker();
  }, [openFilePicker]);

  const handleBackgroundChangeColor = useCallback(() => {
    if (journal.background) {
      setImage(journal.background);
    }

    //store the Color as sting in Schema => journal => image instead on URL
    //expected in backend - type : enum ['Hex','Url'] - value : 'hex string or Url string'
    onImageUpload(journal._id, "Hex", image);
  });

  const enterChangeBackgroundColor = useCallback(() => {
    setInChangeBackgroundColor(true);
  });

  //dictate weather the background is an image or a color string an return the correct value or if customization settings are set and saved
  const CustomizationSwitch = useCallback((background) => {
    function isHex(string) {
      return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(
        string,
      );
    }

    function isImageURL(string) {
      try {
        new URL(string);
        return true;
      } catch {
        return false;
      }
    }

    // HEX → backgroundColor
    if (isHex(background)) {
      return {
        backgroundColor: value,
        borderRadius: "12px",
        borderWidth: "4px",
        borderColor: "#bfdbfe",
      };
    }

    // URL → backgroundImage
    if (isImageURL(background)) {
      return {
        backgroundImage: `url(${value})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "12px",
        borderWidth: "4px",
        borderColor: "#bfdbfe",
      };
    }

    // fallback gradient // default
    return {
      background: "linear-gradient(to right, #4b5563, #1f2937)",
      borderRadius: "12px",
      borderWidth: "4px",
      borderColor: "#bfdbfe",
    };
  }, []);

  return (
    <div
      style={CustomizationSwitch(journalBackground)}
      className={`grid relative place-items-center group border-4 bg-opacity-75
             border-blue-200 px-12 py-48
             text-amber-100 font-medium rounded-lg w-full max-w-xs sm:max-w-sm hover:shadow-2xl
             hover:shadow-blue-400 transition-shadow`}
      {...(!InEdit && { onClick: handleNavigate })}
    >
      <h3 className="mb-6 text-lg sm:text-xl">
        {InEdit ? (
          <input
            name="title"
            type="text"
            value={title}
            onChange={(e) => {
              setShowError(false);
              setTitle(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder={journal.title}
            className={`
                    bg-neutral-100 rounded-lg mb-4 px-4 py-2 text-black text-center 
                    w-full outline-none transition-all duration-300
                    ${
                      showError
                        ? "border-4 border-red-500 animate-pulse"
                        : "border-2 border-transparent focus:border-blue-400"
                    }
                `}
          />
        ) : (
          journal.title
        )}
      </h3>

      <div
        name="interactionButtons"
        className="md:group-hover:opacity-100 md:opacity-10 transition-opacity duration-2200 ease-out group-hover:duration-300 group-hover:ease-in"
      >
        {InEdit ||
        inChangeBackground ||
        inChangeBackgroundImage ||
        inChangeBackgroundColor ? (
          //Delete / cancel
          <HoverButton
            position="left"
            colorBefore="red-400"
            colorAfter="white"
            buttonText="Cancel"
            onClick={handleLeaveEditState}
          />
        ) : (
          <HoverButton
            position="left"
            colorBefore="red-400"
            colorAfter="white"
            buttonText="Delete"
            onClick={handleDelete}
          />
        )}

        {InEdit ? (
          //Edit / Set name // change image // customize color and border

          <HoverButton
            position="right"
            colorBefore="blue-500"
            colorAfter="white"
            buttonText="Set Name"
            onClick={handleEdit}
          />
        ) : (
          <HoverButton
            position="right"
            colorBefore="blue-500"
            colorAfter="white"
            buttonText="Edit"
            onClick={handleEditState}
          />
        )}
        {InEdit && !inChangeBackground ? (
          <HoverButton
            position="top"
            colorBefore="green-400"
            colorAfter="white"
            buttonText="Change Background"
            onClick={handleBackgroundState}
          />
        ) : null}

        {/* image */}
        {inChangeBackground && !inChangeBackgroundColor ? (
          <HoverButton
            position="top-right"
            colorBefore="gray-800"
            colorAfter="white"
            buttonText="Upload Image"
            onClick={enterChangeBackgroundImage}
          />
        ) : null}
        {inChangeBackgroundImage && !inChangeBackgroundColor ? (
          <div>
            <HoverButton
              position="top-left"
              colorBefore="green-500"
              colorAfter="white"
              buttonText="Set background"
              onClick={handleBackgroundChangeImage}
            />
            <HoverButton
              position="top-right"
              colorBefore="gray-800"
              colorAfter="white"
              buttonText="Upload Image"
              onClick={enterChangeBackgroundImage}
            />
          </div>
        ) : null}

        {/* color */}
        {inChangeBackground && !inChangeBackgroundImage ? (
          <HoverButton
            position="top-left"
            colorBefore="gray-800"
            colorAfter="white"
            buttonText="Change Color"
            onClick={enterChangeBackgroundColor}
          />
        ) : null}
        {inChangeBackgroundColor && !inChangeBackgroundImage ? (
          <HoverButton
            position="top-right"
            colorBefore="green-400"
            colorAfter="white"
            buttonText="Set Color"
            onClick={handleBackgroundChangeColor}
          />
        ) : null}
      </div>
    </div>
  );
}

// Memoize component - only re-render if journal, onDelete, or onEdit changes
export default memo(JournalCard);
