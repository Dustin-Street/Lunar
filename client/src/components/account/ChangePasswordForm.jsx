import { useState } from "react";

export default function PasswordChangeForm({ changePassword, setButtonState }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldpassword, setShowOldPassword] = useState(false);
  const [showNewpassword, setShowNewPassword] = useState(false);
  const [errorPulse, setErrorPulse] = useState(false);

  const clearForm = () => {
    setOldPassword("");
    setNewPassword("");
  };

  const triggerPulse = () => {
    setErrorPulse(true);
    setTimeout(() => {
      setErrorPulse(false);
    }, 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const result = await changePassword(oldPassword, newPassword);
    console.log(result);
    if (result?.success === true) {
      clearForm();
      setButtonState((prev) => ({
        ...prev,
        [0]: false,
      }));
    } else {
      triggerPulse();
    }
  };

  return (
    <div>
      <form
        className="flex flex-col items-center"
        onSubmit={(e) => {
          handleChangePassword(e);
        }}
      >
        <h2 className="text-2xl mb-4">Change Password</h2>

        <div
          className={`
          grid items-center mb-4 bg-gray-800 rounded-lg p-3 w-full lg:w-1/2
          border border-gray-300
         focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200
        ${errorPulse ? "border-red-500 animate-pulse" : ""}
       `}
        >
          <label htmlFor="login-password" className="sr-only">
            Current Password
          </label>

          <input
            type={showOldpassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Current Password"
            name="old password"
            id="old-password"
            value={oldPassword}
            className="bg-gray-800  flex-1 outline-none col-start-1 row-start-1 w-full"
            onChange={(event) => setOldPassword(event.target.value)}
            maxLength={128}
            aria-invalid={!!errorPulse}
            aria-describedby={errorPulse ? "old-password-error" : undefined}
          />

          <button
            type="button"
            className="text-gray-300 ml-auto col-start-1 row-start-1"
            onClick={() => setShowOldPassword(!showOldpassword)}
            aria-label={showOldpassword ? "Hide password" : "Show password"}
          >
            {showOldpassword ? "hide" : "show"}
          </button>
        </div>

        <div
          className={`grid items-center mb-4 bg-gray-800 rounded-lg p-3
          border border-gray-300 w-full lg:w-1/2
         focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200
        ${errorPulse ? "border-red-500 animate-pulse" : ""}`}
        >
          <label htmlFor="login-password" className="sr-only">
            New Password
          </label>
          <input
            type={showNewpassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="New Password"
            name="new password"
            id="new-password"
            value={newPassword}
            className={`bg-gray-800 col-start-1 row-start-1 flex-1 outline-none w-full`}
            onChange={(event) => setNewPassword(event.target.value)}
            maxLength={128}
            aria-invalid={!!errorPulse}
            aria-describedby={errorPulse ? "new-password-error" : undefined}
          />

          <button
            type="button"
            className="text-gray-300 ml-auto col-start-1 row-start-1"
            onClick={() => setShowNewPassword(!showNewpassword)}
            aria-label={showNewpassword ? "Hide password" : "Show password"}
          >
            {showNewpassword ? "hide" : "show"}
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
