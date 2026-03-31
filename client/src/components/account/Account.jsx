import { useState } from "react";
import { useFlashMessage } from "../context/FlashMessageContext";
import useAccount from "../../hooks/useAccount";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../layout/LoadingOverlay";

export default function Account() {
  const { user, loading, setLoading, changePassword } = useAccount();
  const { setFlashMessage } = useFlashMessage();
  const [buttonState, setButtonState] = useState({});
  const [passwordVerified, setPasswordVerified] = useState(false);
  const navigate = useNavigate();

  const redirectIfNoUser = () => {
    if (!user) {
      setFlashMessage('Redirected for account safety');
      window.location.href = "/login";
    }
  };

  const ButtonStateSwitch = (setTime, index) => {
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
  const submitChangePassword = () => {
    changePassword(user._id);
  };

  const submitDeleteAccount = () => {
    try {
      //send request to server to verifiy account password
      sendPasswordVerification();
    } catch (error) {
      //document error and attach to user account details
    } finally {
      if (user && passwordVerified) {
        //finally send the request to the backend to permenetly Delete the account, send reminder email that services rendered will
        //be cancelled effective immediatly with optional servey for reason for leaving...
        //erase account and all information that is bound to the account
      }
    }
  };

  const submitCancelSubscription = () => {
    try {
      //send request to server to verifiy account password
    } catch (error) {
      //document error and attach to user account details
    } finally {
      if (user && handlePasswordVerification) {
        //finally send a request to terminate the user billing cycle per the request
      }
    }
  };

  const LoadingStateTest = () => {
    if (loading) {
      setLoading(false);
    }
    setLoading(true);
  };

  //need to pass up to parent component to handle state for password verification, then pass down to this component to render the verification form when user clicks on Delete Account button.
  //set loading state to false in finally block of password verification form to allow user to proceed with action after success or failed verification.

  //need to create loading state that fades background and disables buttons when user clicks on Delete Account button, then set loading state to false in finally block of password verification form to allow user to proceed with action after success or failed verification.
  const handlePasswordVerification = () => {
    return (
      <form onSubmit={submitDeleteAccount}>
        <h2 className="text-2xl mb-4">Enter Current Password</h2>
        <input
          type="password"
          placeholder="Current Password"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button className="w-full bg-red-300 text-white p-3 rounded-lg hover:bg-red-600 transition duration-200">
          Delete
        </button>
        <p className="text-red-300 mt-4">
          Warning: This action cannot be undone.
        </p>
      </form>
    );
    //implement for sensitive actions like Delete Account, then send verification for 2-step verification before allowing user to proceed with action.
    //  This is for security purposes and to prevent unauthorized access to sensitive actions.
  };

  return !user ? (
    <div
      name="redirectIfNotUse"
      className="flex flex-col min-h-screen bg-gray-800 items-center"
    >
      <h1 className="lg:text-3xl text-2xl text-amber-100 mb-8 font-semibold font-serif mt-10 border-b-2 border-blue-200 pb-2 ">
        {LoadingOverlay({ message: "Redirecting..." })}
        {redirectIfNoUser()}
      </h1>
    </div>
  ) : (
    <div name="accountPage" className="relative min-h-screen w-full">
      <button onClick={LoadingStateTest}>test loading state</button>
      {loading && <LoadingOverlay message="Processing request..." />}

      <div
        className={`flex flex-col relative min-h-screen w-full bg-gray-800 items-center ${loading ? "opacity-40 blur-sm pointer-events-none" : ""}`}
      >
        <h1 className="lg:text-3xl text-2xl text-amber-100 mb-8 font-semibold font-serif mt-10 border-b-2 border-blue-200 pb-2 ">
          {user.username}'s Account
        </h1>
        <div
          name="account-info"
          className="text-amber-100 lg:text-xl text-lg mb-12 md:w-3/4 w-full px-4 text-center"
        >
          <ul
            name="account-info-list"
            className="space-y-6 border-3 border-blue-200 p-10 rounded-2xl shadow-2xl group "
          >
            <li>
              {/* buttonState[0] */}
              <button
                className="hover:saturate-200 hover:bg-gray-800 p-4 rounded-2xl px-20"
                onClick={async () => {
                  await submitChangePassword();
                  ButtonStateSwitch(4000, 0);
                }}
              >
                {buttonState[0]
                  ? "Verification Email Sent..."
                  : "Change Password"}
              </button>
            </li>
            <li>
              {/* buttonState[1] */}
              <button
                className="hover:saturate-200 hover:bg-gray-800 p-4 rounded-2xl px-20"
                onClick={() => ButtonStateSwitch(20000, 1)}
              >
                {buttonState[1] ? "Verification Email Sent..." : "Change Email"}
              </button>
            </li>
            <li>
              {/* buttonState[2] */}
              <button className="hover:saturate-200 hover:bg-gray-800 p-4 rounded-2xl px-20">
                Manage Profile
              </button>
            </li>
            <li>
              {/* buttonState[3] */}
              <button
                className="hover:saturate-200 hover:bg-gray-800 p-4 text-red-200 rounded-2xl px-20"
                onClick={() => ButtonStateSwitch(20000, 3)}
              >
                {buttonState[3]
                  ? handlePasswordVerification()
                  : "Delete Account"}
              </button>
            </li>
          </ul>
        </div>
        <div
          name="account-settings"
          className="text-amber-100 lg:text-xl text-lg mb-12 md:w-3/4 w-full px-4 text-center"
        >
          <h2 className="mb-3 text-2xl">Account Preferences</h2>
          <ul
            name="account-settings-list"
            className="space-y-6 border-3 border-blue-200 p-10 rounded-2xl shadow-2xl group"
          >
            <li>
              {/* buttonState[4] */}
              <button className="hover:saturate-200 hover:bg-gray-800 p-4 rounded-2xl px-20">
                Themes
              </button>
            </li>
            <li>
              {/* buttonState[5] */}
              <button className="hover:saturate-200 hover:bg-gray-800 p-4 rounded-2xl px-20">
                Notification Settings
              </button>
            </li>
            <li>
              <button className="hover:saturate-200 hover:bg-gray-800 p-4 rounded-2xl px-20   ">
                Privacy Settings
              </button>
            </li>
            <li>
              {/* buttonState[7] */}
              <button className="hover:saturate-200 hover:bg-gray-800 p-4 rounded-2xl px-20">
                User Data Export
              </button>
            </li>
          </ul>
        </div>
        <div
          name="payment-info"
          className="text-amber-100 lg:text-xl text-lg mb-12 md:w-3/4 w-full px-4 text-center"
        >
          <h2 className="mb-3 text-2xl">Payment | Subscription </h2>
          <ul
            name="payment-info-list"
            className="space-y-6 border-3 border-blue-200 p-10 rounded-2xl shadow-2xl group"
          >
            <li>
              <button className="hover:saturate-200 hover:bg-gray-800 p-4 rounded-2xl px-20">
                Manage Subscription
              </button>
            </li>
            <li>
              <button className="hover:saturate-200 hover:bg-gray-800 p-4 rounded-2xl px-20">
                Payment Methods
              </button>
            </li>
            <li>
              <button className="hover:saturate-200 hover:bg-gray-800 p-4 rounded-2xl px-20   ">
                Billing History
              </button>
            </li>
            <li>
              <button className="hover:saturate-200 hover:bg-gray-800 p-4 rounded-2xl px-20 text-red-200">
                Cancel Subscription
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
