import { useState } from "react";

export default function PasswordChangeForm({
  changePassword,
  buttonState,
  setButtonState,
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showoldpassword, setShowoldPassword] = useState(false);
  const [shownewpassword, setShownewPassword] = useState(false);

  const clearForm = () => {
    setOldPassword("");
    setNewPassword("");
  };

  //placeholder for more robust front-end check before sending to backend - pair with backend validation on password strength and validation
  const checkIfValidPassword = () => {};

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          changePassword(oldPassword, newPassword);
          clearForm();
          setButtonState((prev) => ({
            ...prev,
            [0]: false,
          }));
        }}
      >
        <h2 className="text-2xl mb-4">Change Password</h2>

        <div className="relative ">
          <label htmlFor="current-password" className="sr-only">
            Current password
          </label>
          <input
            id="current-password"
            type={showoldpassword ? "text" : "password"}
            placeholder="Current Password"
            autoComplete="current-password"
            className="w-full p-3 mb-4 lg:ms-20 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:to-blue-200 lg:w-1/2"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
          />
          <button
            type="button"
            className="inline p-4 items-center text-gray-500 hover:text-amber-100 mb-4"
            onClick={() => setShowoldPassword(!showoldpassword)}
            aria-label={showoldpassword ? "Hide current password" : "Show current password"}
          >
            {showoldpassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="relative">
          <label htmlFor="new-password" className="sr-only">
            New password
          </label>
          <input
            id="new-password"
            type={shownewpassword ? "text" : "password"}
            placeholder="New Password"
            autoComplete="new-password"
            className="w-full p-3 mb-4 rounded-lg border lg:ms-20 border-gray-300 focus:outline-none focus:ring-2 focus:to-blue-200 lg:w-1/2"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          <button
            type="button"
            className="inline p-4 items-center text-gray-500 hover:text-amber-100 mb-4"
            onClick={() => setShownewPassword(!shownewpassword)}
            aria-label={shownewpassword ? "Hide new password" : "Show new password"}
          >
            {shownewpassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full lg:w-1/2 bg-blue-200 text-black p-3 rounded-lg 
                 hover:bg-blue-400 hover:text-amber-100 transition duration-200"
        >
          Change Password
        </button>
        <button
          type="button"
          className="w-full bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-400  hover:text-amber-100 transition duration-200 mt-1 lg:w-1/2 md:block justify-self-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            clearForm();
            setButtonState((prev) => ({
              ...prev,
              [0]: false,
            }));
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
