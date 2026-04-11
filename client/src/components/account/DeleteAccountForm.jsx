import { useState } from "react";

export default function DeleteAccountForm({
  deleteAccountRequest,
  setButtonState,
}) {
  const [userInputValidation, setUserInputValidation] = useState("");
  const ValidationString = "Delete my Account";

  const clearForm = () => {
    setUserInputValidation("");
  };

  return (
    <div>
      <div className="relative w-full h-1/2">
        <input
          type="text"
          placeholder="Current Password"
          autoComplete="none"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:to-blue-200 md:w-1/2"
          value={userInputValidation}
          onChange={(e) => {
            setUserInputValidation(e.target.value);
          }}
        />
        <button
          type="submit"
          className="w-full bg-red-400 text-black p-3 rounded-lg hover:bg-red-600 hover:text-white transition duration-200 md:w-1/2 md:block block justify-self-center"
        >
          Delete Account
        </button>
      </div>
      <button
        type="button"
        className="w-full bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-400  hover:text-amber-100 transition duration-200 mt-1 md:w-1/2 md:block block justify-self-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setButtonState((prevState) => ({
            ...prevState,
            [3]: false,
          }));
        }}
      >
        Cancel
      </button>
    </div>
  );
}
