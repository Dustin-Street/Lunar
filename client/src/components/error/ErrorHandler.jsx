import React from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import { useAuth } from "../context/AuthContext";
const useEffect = React.useEffect;

/**
 * ErrorHandler Component
 * This component is responsible for handling errors that occur in the frontend of the application. It captures error details, including the error message, stack trace, timestamp, and user information (if available). The error details are then sent to the backend for logging and analysis. This allows developers to track and address issues that users may encounter while using the application.
 * The ErrorHandler component can be used globally to catch unhandled errors or can be integrated into specific components to handle errors locally. It ensures that users receive feedback when an error occurs and that developers have the necessary information to debug and improve the application.
 *
 * @returns Error Object to be sent and bound to user schema The ErrorHandler component.
 */
const ErrorHandler = ({ error }) => {
  const { user } = useAuth();
  /**
   * ErrorBody Object
   * This object is structured to capture comprehensive details about an error that occurs in the frontend. It includes the error message, stack trace, timestamp of when the error occurred, a flag to indicate that the error originated from the frontend, and the user ID if the user is logged in. This structured format allows for consistent logging and easier debugging when errors are sent to the backend for analysis.
   */

  const ErrorBody = {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    flag: "frontend",
    userId: user ? user._id : null,
  };

  const CatchError = (error) => {
    // Log the error to the console for immediate feedback during development
    console.error("An error occurred:", error);
    //then send the error details to the backend for logging and analysis for support personal or developers to review and address the issue
    axios
      .post(`${API_BASE_URL}/logError`, ErrorBody)
      .then((response) => {
        console.log("Error logged successfully:", response.data);
      })
      .catch((err) => {
        console.error("Failed to log error:", err);
        //send to a third party error tracking service like Sentry or LogRocket as a fallback potentially
      });
  };
};

export default ErrorHandler;
