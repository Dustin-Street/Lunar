// impletement a custom hook for managing user account subscription, profile updates, and account deletion
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFlashMessage } from "../components/context/FlashMessageContext";
import { useAuth } from "../components/context/AuthContext";
import { API_BASE_URL } from "../utils/api";

export default function useAccount() {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { login } = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setFlashMessage } = useFlashMessage();

  //pull user data to view and update profile information READ
  const fetchUserAccount = useCallback(async () => {
    try {
      if (!user) {
      }
    } catch (err) {
      console.error("Fetch user account error:", err);
      setError(
        err.response?.data?.message || "Failed to fetch account details",
      );
    }
  }, []);

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

      setFlashMessage(serverMsg || error?.message || "Signup failed, try again...");
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

      if (response.data.success) {
        if (login) {
          login({
            _id: response.data.user._id,
            username: response.data.user.username,
            email: response.data.user.email,
          });
        }

        navigate("/journalSelect").then(() => {
          setFlashMessage(
            "Login successful, " + response.data.user.username + "!",
          );
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setFlashMessage(err.response?.data?.message || "Login failed");
    }
  };

  const changePassword = async (userid) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/account/password-reset-request/${userid}`,
        {
          withCredentials: true,
        },
      );

      setFlashMessage(response.data.message);
    } catch (error) {
      const serverMsg =
        error?.response?.data?.message || error?.response?.data?.error;

      setFlashMessage(
        serverMsg || error?.message || "Password change failed...try again",
      );
    } finally {
      setLoading(false);
    }
  };

  //pull user data to view and update profile information READ

  //delete account DELETE

  return {
    user,
    error,
    loading,
    setLoading,
    changePassword,
    userSignup,
    userLogin,
  };
}
