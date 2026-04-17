import { useState } from "react";

export default function DeleteAccountForm({
  requestDeleteAccount,
  setButtonState,
}) {
  const [userInputValidation, setUserInputValidation] = useState("");
  const [errorPulse, setErrorPulse] = useState(false);
  const ValidationString = "Delete Account";

  const clearForm = () => {
    setUserInputValidation("");
  };

  const triggerPulse = () => {
    setErrorPulse(true);
    setTimeout(() => {
      setErrorPulse(false);
    }, 2000);
  };

  const handleStringVerification = () => {
    if (userInputValidation === ValidationString) {
      requestDeleteAccount();
    } else triggerPulse();
  };

  return (
    <form
      className="flex flex-col items-center mx-0 relative"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="relative w-full md:w-1/2">
        <input
          id="confirm-delete"
          type="text"
          value={userInputValidation}
          onChange={(e) => setUserInputValidation(e.target.value)}
          className={`w-full p-3 rounded-lg border bg-gray-800 text-amber-100
      focus:outline-none focus:ring-2 focus:ring-blue-200
      ${errorPulse ? "animate-pulse border-red-500 shadow-lg shadow-red-400" : ""}
    `}
        />

        <label
          htmlFor="confirm-delete"
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-red-400 
      pointer-events-none transition-all duration-200
      ${userInputValidation ? "text-xs top-[-26px] -translate-y-1" : ""}
    `}
        >
          Confirm by typing "Delete Account"
        </label>
      </div>

      {errorPulse ? (
        <p className="text-red-400 animate-pulse">Incorrect validation input</p>
      ) : null}

      <button
        type="button"
        className="w-full md:w-1/2 bg-red-400 text-black p-3 rounded-lg 
               hover:bg-red-400 hover:text-white transition duration-200 mt-2"
        onClick={handleStringVerification}
      >
        Delete Account
      </button>

      <button
        type="button"
        className="w-full md:w-1/2 bg-gray-200 text-gray-800 p-3 rounded-lg 
               hover:bg-gray-400 hover:text-white transition duration-200 mt-1"
        onClick={() =>
          setButtonState((prev) => ({
            ...prev,
            3: false,
          }))
        }
      >
        Cancel
      </button>
      <p className="text-sm text-red-400"> This cannot be undone and will delete all journals and enties</p>
    </form>
  );
}
