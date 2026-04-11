import { useState } from "react";
import { useFilePicker } from "use-file-picker";
/**
 * @param function takes the server side function that will change the user profile image
 * @returns JSX element : A panel for the user to customize their profile.
 */

export default function ManageProfilePanel({
  changeProfileImage,
  ButtonState,
  setButtonState,
}) {
  const [imageSelected, setImageSelected] = useState(false);

  //file selector options for image upload
  const { filesContent, errors, openFilePicker, loading } = useFilePicker({
    accept: ".jpg,.png,.pdf", // Specify allowed file types
    multiple: false, // Allow multiple file selection
    onFilesSuccessfullySelected: ({ filesContent }) => {
      console.log("Files successfully selected:", filesContent);
      changeProfileImage(filesContent[0]);
      if (changeProfileImage) {
        setButtonState((prevState) => ({
          ...prevState,
          [2]: false,
        }));
        setImageSelected(true);
      }
    },
    onFilesRejected: ({}) => {
      console.log("File selection rejected. Errors:", errors);
      setFlashMessage(
        "Image upload failed, Supported types are - .PNG .JPG .PDF under 1000mb",
      );
    },
  });

  return (
    <div name="manageProfilePanel" className="relative w-full h-1/2">
      <div name="profileImage">
        <p>Manage Profile</p>
        <img
          className="w-16 h-16 m-4 inline"
          src="/images/ProfileNoBG.png"
          alt=""
        />
        <button
          className="inline bg-blue-200 rounded-lg px-2 py-1 text-black hover:text-amber-100 hover:bg-blue-400 hover:shadow-amber-100 shadow-sm"
          onClick={() => {
            openFilePicker();
          }}
        >
          Upload
        </button>

        {imageSelected ? (
          <button
            type="submit"
            className="w-full bg-blue-200 text-black p-3 rounded-lg hover:bg-blue-400 hover:text-amber-100 transition duration-200 md:w-1/2 md:block justify-self-center"
          >
            Change Image
          </button>
        ) : null}
      </div>
      <button
        type="button"
        className="w-full bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-400  hover:text-amber-100 transition duration-200 mt-1 md:w-1/2 md:block block justify-self-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setButtonState((prevState) => ({
            ...prevState,
            [2]: false,
          }));
        }}
      >
        Cancel
      </button>
    </div>
  );
}
