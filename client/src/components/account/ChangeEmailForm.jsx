import { useState } from "react";
import { useFlashMessage } from "../context/FlashMessageContext";

export default function PasswordChangeForm({
  changeEmail,
  buttonState,
  setButtonState,
}) {
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const { setFlashMessage } = useFlashMessage;

  const clearForm = () => {
    setNewEmail("");
    setOldEmail("");
  };

  //placeholder for more robust front-end validation before sending request to back paired with back-end schema validation
  const checkIfValidEmail = (email) => {
    //regex check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div>
      <form
        className="flex flex-col items-center text-center"
        onSubmit={(e) => {
          e.preventDefault();
          if (checkIfValidEmail(newEmail)) {
            e.preventDefault();
            changeEmail(oldEmail, newEmail);
            clearForm();
            setButtonState((prev) => ({ ...prev, 1: false }));
          }
        }}
      >
        <h2 className="text-2xl mb-4 self-star justift-self-center">Change Email</h2>

        <label htmlFor="current-email" className="sr-only">
          Current email address
        </label>
        <input
          id="current-email"
          type="email"
          placeholder="Current Email"
          autoComplete="email"
          className="w-full lg:w-1/2 p-3 mb-4 rounded-lg border border-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={oldEmail}
          onChange={(e) => setOldEmail(e.target.value)}
        />

        <label htmlFor="new-email" className="sr-only">
          New email address
        </label>
        <input
          id="new-email"
          type="email"
          placeholder="New Email"
          autoComplete="email"
          className="w-full lg:w-1/2 p-3 mb-4 rounded-lg border border-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full lg:w-1/2 bg-blue-200 text-black p-3 rounded-lg 
                 hover:bg-blue-400 hover:text-amber-100 transition duration-200"
        >
          Change Email
        </button>

        <button
          type="button"
          className="w-full lg:w-1/2 bg-gray-200 text-gray-800 p-3 rounded-lg 
                 hover:bg-gray-400 hover:text-amber-100 transition duration-200 mt-1"
          onClick={() => {
            clearForm();
            setButtonState((prev) => ({ ...prev, 1: false }));
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
