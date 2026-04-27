// impletement a custom hook for managing user account subscription, profile updates, and account deletion
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFlashMessage } from "../components/context/FlashMessageContext";
import { useAuth } from "../components/context/AuthContext";
import { API_BASE_URL } from "../utils/api";
import { binaryStringToFile } from "../utils/binaryStringToFile";
import { validateImage } from "../utils/validateImage";
import { memeTypeCheck } from "../utils/memeTypeCheck";

export default function useAccount() {
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const { user, accessToken } = useAuth();
  const [userAccountSettings, setUserAccountSettings] = useState({});
  const navigate = useNavigate();
  const { setFlashMessage } = useFlashMessage();

  //pull user data to view and update profile information READ
  const fetchUserAccount = useCallback(async () => {
    if (!user || !accessToken) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/account/requestSettings`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      // setting user account setting from user schema -> need to add more details to user schema for subscription and profile settings
      if (setUserAccountSettings(response.data)) {
        console.log("User account settings fetched successfully");
      }
      // whatever you want to do with the data
    } catch (err) {
      console.log("Fetch user account error:", err);
    } finally {
      setLoading(false);
    }
  }, [user, accessToken]);

  useEffect(() => {
    fetchUserAccount();
  }, [fetchUserAccount]);

  //Signup

  const userSignup = async (email, username, password) => {
    const userData = { email, username, password };
    const axiosOptions = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/account/createUser`,
        userData,
        axiosOptions,
      );
      login(response.data.user, response.data.token);
      navigate("/").then(() => {
        setFlashMessage(
          "Signup successful, " + response.data.user.username + "!",
        );
      });
    } catch (error) {
      const serverMsg =
        error?.response?.data?.message || error?.response?.data?.error;

      setFlashMessage(
        serverMsg || error?.message || "Signup failed, try again...",
      );
    } finally {
      setLoading(false);
    }
  };

  //login

  const userLogin = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/account/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // cookie comes back here
        },
      );
      console.log("after api call");
      if (response.data.success) {
        console.log("response data success after");
        if (login) {
          console.log("login true");
          login(
            {
              _id: response.data.user._id,
              username: response.data.user.username,
              email: response.data.user.email,
              profile: response.data.user.profile,
            },
            response.data.token,
            response.data.expiresIn,
          );
        }
        console.log("response data success after");
        navigate("/").then(() => {
          setFlashMessage(
            "Login successful, " + response.data.user.username + "!",
          );
        });
        console.log("after navigate");
      }
    } catch (err) {
      console.error("Login error:", err);
      setFlashMessage(err.response?.data?.message || "Login failed");
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      setLoading(true);

      const response = await axios.patch(
        `${API_BASE_URL}/account/change-password`,
        { oldPassword: oldPassword, newPassword: newPassword },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setFlashMessage(response.data.message);
    } catch (error) {
      console.log(error, "from catch");
      const serverMsg =
        error?.response?.data?.message || error?.response?.data?.error;

      setFlashMessage(
        serverMsg || error?.message || "Password change failed...try again",
      );
    } finally {
      setLoading(false);
    }
  };

  const changeEmail = async (oldEmail, newEmail) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `${API_BASE_URL}/account/change-email`,
        { oldEmail: oldEmail, newEmail: newEmail },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setFlashMessage(response.data.message);
    } catch (error) {
      const serverMsg =
        error?.response?.data?.message || error?.response?.data?.error;

      setFlashMessage(
        serverMsg || error?.message || "Email change failed...try again",
      );
    } finally {
      setLoading(false);
    }
  };

  //still need to finish this logic !
  const resetPassword = async (email) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/account/request-password-reset`,
      );
      if (response)
        setFlashMessage(
          response?.message || "Sent reset instructions to email",
        );
      setLoading(true);
    } catch (error) {
      const serverMsg =
        error?.response?.data?.message || error?.response?.data?.error;

      setFlashMessage(
        serverMsg || error?.message || "password change failed...try again",
      );
    } finally {
      setLoading(false);
    }
  };

  const requestDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${API_BASE_URL}/account/requestDeleteAccount`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      logout();
      navigate("/");
      setFlashMessage(
        response?.data?.message || "Account Deleted successfully",
      );
    } catch (error) {
      const serverMsg =
        error?.response?.data?.message || error?.response?.data?.error;

      setFlashMessage(
        serverMsg || error?.message || "Image upload failed...try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  //pull user data to view and update profile information READ

  //delete account DELETE

  return {
    user,
    loading,
    resetPassword,
    requestDeleteAccount,
    setLoading,
    changePassword,
    changeEmail,
    userSignup,
    userLogin,
  };
}
