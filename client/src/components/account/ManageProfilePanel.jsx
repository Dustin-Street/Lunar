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
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState("");

  const handleUpdateImage = () => {
    console.log(selectedFile);
    changeProfileImage(selectedFile);
  };

  function handleFileChange(e) {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImageSelected(true);
    setPreview(URL.createObjectURL(file)); // <-- THIS is what you display
  }

  //file selector options for image upload
  // const { filesContent, errors, openFilePicker, loading } = useFilePicker({
  //   accept: ".jpg,.png,.pdf", // Specify allowed file types
  //   multiple: false, // Allow multiple file selection
  //   onFilesSuccessfullySelected: ({ filesContent }) => {
  //     console.log("Files successfully selected:", filesContent);
  //     changeProfileImage(filesContent[0]);
  //     if (changeProfileImage) {
  //       setButtonState((prevState) => ({
  //         ...prevState,
  //         [2]: false,
  //       }));
  //       setImageSelected(true);
  //     }
  //   },
  //   onFilesRejected: ({}) => {
  //     console.log("File selection rejected. Errors:", errors);
  //     setFlashMessage(
  //       "Image upload failed, Supported types are - .PNG .JPG .PDF under 1000mb",
  //     );
  //   },
  // });

  return (
    <div name="manageProfilePanel" className="relative w-full h-1/2">
      <div name="profileImage">
        <p>Manage Profile</p>

        {selectedFile ? (
          <img
            className="w-16 h-16 m-4 rounded-full border-2 border-blue-200 inline"
            src={preview}
            alt="your image"
          />
        ) : (
          <img
            className="w-16 h-16 m-4 inline"
            src="/images/ProfileNoBG.png"
            alt=""
          />
        )}
        <input
          type="file"
          accept="image/png, image/jpeg"
          className={`border-2 p-2 bg-gray-700 border-blue-200 rounded-2xl  `}
          onChange={(e) => {
            handleFileChange(e);
          }}
        />

        {imageSelected ? (
          <button
            type="submit"
            className="w-full bg-blue-200 text-black p-3 rounded-lg hover:bg-blue-400 hover:text-amber-100 transition duration-200 md:w-1/2 md:block justify-self-center"
            onClick={() => handleUpdateImage()}
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
