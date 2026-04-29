import { useState } from "react";
import { AuthGuard } from "../context/AuthContext";
import useAccount from "../../hooks/useAccount";
import LoadingOverlay from "../layout/LoadingOverlay";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeEmailForm from "./ChangeEmailForm";
import DeleteAccountForm from "./DeleteAccountForm";

export default function Account() {
  const { user, loading, changePassword, changeEmail, requestDeleteAccount } =
    useAccount();
  const [buttonState, setButtonState] = useState(Array(4).fill(false));
  if (!user) {
    return (
      <AuthGuard>
        <LoadingOverlay message="Loading account information..." />
      </AuthGuard>
    );
  }

  //timer function to button state
  const ButtonStateSwitchTimer = (setTime, index) => {
    setButtonState((prevState) => ({
      ...prevState,
      [index]: true,
    }));

    setTimeout(() => {
      setButtonState((prevState) => ({
        ...prevState,
        [index]: false,
      }));
    }, setTime);
  };

  // on / off style function for button state
  const ButtonStateSwitch = (index) => {
    if (buttonState[index] === false) {
      setButtonState((prevState) => ({
        ...prevState,
        [index]: true,
      }));
    }
    if (buttonState[index] === true) {
      setButtonState((prevState) => ({
        ...prevState,
        [index]: false,
      }));
    }
    return;
  };

  return (
    <AuthGuard>
      <div name="accountPage" className="relative min-h-screen w-full mx-0">
        {loading && <LoadingOverlay message="Processing request..." />}

        <div
          className={`flex flex-col  min-h-screen w-full bg-gray-800 items-center mx-0 ${loading ? "opacity-40 blur-sm pointer-events-none" : ""}`}
        >
          <h1 className="lg:text-3xl text-lg text-amber-100 mb-8 font-semibold font-serif mt-10 pb-2 ">
            Account
          </h1>
          <div
            name="account-info"
            className="text-amber-100 lg:text-xl text-lg mb-12 lg:w-3/4 w-full px-4 text-center"
          >
            <ul
              name="account-info-list"
              className="space-y-12  p-10 rounded-2xl shadow-2xl group flex-row "
            >
              <li>
                <div
                  className={`hover:bg-blue-400 text-black  bg-blue-200 hover:shadow-md hover:shadow-amber-100 p-4 rounded-2xl md:px-20 ${buttonState[0] === true ? "hover:bg-gray-800 bg-gray-800 shadow-sm shadow-amber-100m text-white" : null}`}
                  onClick={
                    buttonState[0] === false ? () => ButtonStateSwitch(0) : null
                  }
                >
                  {buttonState[0] ? (
                    <ChangePasswordForm
                      changePassword={changePassword}
                      buttonState={buttonState}
                      setButtonState={setButtonState}
                    />
                  ) : (
                    "Change Password"
                  )}
                </div>
              </li>
              <li>
                {/* buttonState[1] */}
                <div
                  className={`hover:bg-blue-400 text-black  bg-blue-200 hover:shadow-md hover:shadow-amber-100 p-4 rounded-2xl md:px-20 ${buttonState[1] === true ? "hover:bg-gray-800 bg-gray-800 shadow-sm shadow-amber-100m text-white" : null}`}
                  onClick={
                    buttonState[1] === false ? () => ButtonStateSwitch(1) : null
                  }
                >
                  {buttonState[1] ? (
                    <ChangeEmailForm
                      changeEmail={changeEmail}
                      buttonState={buttonState}
                      setButtonState={setButtonState}
                    />
                  ) : (
                    "Change Email"
                  )}
                </div>
              </li>
              {/* buttonState[2] */}
              <li>
                <div
                  className={`hover:bg-blue-400 text-black  bg-blue-200 hover:shadow-md hover:shadow-amber-100 p-4 rounded-2xl md:px-20 ${buttonState[2] === true ? "hover:bg-gray-800 bg-gray-800 shadow-sm shadow-amber-100m text-white" : null}`}
                  onClick={
                    buttonState[2] === false ? () => ButtonStateSwitch(2) : null
                  }
                >
                  {buttonState[2] ? <></> : "Manage Profile"}
                </div>
              </li>
              <li>
                {/* buttonState[3] */}
                <div
                  className={`hover:saturate-100 text-black ${buttonState[3] === false ? "bg-red-400 hover:shadow-md hover:shadow-red-500" : null}  p-4 rounded-2xl md:px-20 ${buttonState[3] === true ? "hover:bg-gray-800 bg-gray-800 shadow-sm shadow-amber-100 text-white" : null}`}
                  onClick={
                    buttonState[3] === false ? () => ButtonStateSwitch(3) : null
                  }
                >
                  {buttonState[3] ? (
                    <DeleteAccountForm
                      requestDeleteAccount={requestDeleteAccount}
                      setButtonState={setButtonState}
                    />
                  ) : (
                    "Delete Account"
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
