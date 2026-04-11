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

        <div className="relative">
          <input
            type={showoldpassword ? "text" : "password"}
            placeholder="Current Password"
            autoComplete="none"
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:to-blue-200 md:w-1/2"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
          />
          <button
            type="button"
            className="absolute inset-y-0 left-48 lg:left-304 md:left-24 px-4 flex items-center text-gray-600 hover:text-gray-700"
            onClick={() => setShowoldPassword(!showoldpassword)}
          >
            {showoldpassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="relative">
          <input
            type={shownewpassword ? "text" : "password"}
            placeholder="New Password"
            autoComplete="none"
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:to-blue-200 md:w-1/2"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          <button
            type="button"
            className="absolute inset-y-0 left-48 lg:left-304 md:left-224 px-4 flex items-center text-gray-600 hover:text-gray-700"
            onClick={() => setShownewPassword(!shownewpassword)}
          >
            {shownewpassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-200 text-black p-3 rounded-lg hover:bg-blue-400 hover:text-amber-100 transition duration-200 md:w-1/2 md:block justify-self-center"
        >
          Change Password
        </button>
        <button
          type="button"
          className="w-full bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-400  hover:text-amber-100 transition duration-200 mt-1 md:w-1/2 md:block justify-self-center"
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
