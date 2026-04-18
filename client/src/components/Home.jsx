import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { useAuth } from "./context/AuthContext";
import LoginSignupCard from "./layout/LoginSignupCard";
import UserOverviewCard from "./layout/UserOverviewCard";
import LoudingOverlay from "./layout/LoadingOverlay";
import { API_BASE_URL } from "../utils/api";
import LoadingOverlay from "./layout/LoadingOverlay";
import { useFlashMessage } from "./context/FlashMessageContext";

export default function Home() {
  const [quote, setQuote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statistics, setStatistics] = useState();
  const { user, isAuthenticated, accessToken } = useAuth();

  useEffect(() => {
    async function getInitialQuote() {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/quotes/quote`);
        setQuote(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getInitialQuote();
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    async function updateAndGetUserStatistics() {
      try {
        setLoadingStats(true);
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/account/requestStatistics`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        setStatistics(response.data.user);
      } catch (error) {
        console.error(error);
        useFlashMessage("error receiving your Activity report");
      } finally {
        setLoading(false);
        setLoadingStats(false);
      }
    }
    updateAndGetUserStatistics();
  }, [accessToken]);

  const random = quote.length ? Math.floor(Math.random() * quote.length) : 0;
  console.log(statistics);

  return (
    <>
      {loading ? (
        <div className="min-h-screen bg-[url('images/deepnight3.jpg')] bg-center bg-no-repeat flex items-center justify-center">
          <LoadingOverlay />
        </div>
      ) : (
        <div className="min-h-screen bg-[url('images/deepnight3.jpg')] bg-center bg-no-repeat text-white px-4 py-12 space-y-20">
          {/* HERO SECTION */}
          <div className="bg-gray-800/70 rounded-2xl p-8 max-w-3xl mx-auto mb-2 mt-2 max-h-screen shadow-md shadow-blue-200 space-y-2">
            <section className="flex flex-col items-center text-center space-y-6">
              <h1 className="text-3xl md:text-5xl font-serif text-amber-100 animate-fadeIn">
                Welcome to Lunar
              </h1>

              <p className="max-w-2xl text-blue-200 text-lg leading-relaxed">
                A calm, private space to reflect, grow, and understand your day.
                free to use by everyone.
              </p>

              {!isAuthenticated ? (
                <LoginSignupCard />
              ) : (
                <UserOverviewCard
                  stats={statistics}
                  user={user}
                  statisticsloading={loadingStats}
                />
              )}
            </section>
          </div>

          {/* SUPPORT SECTION */}
          <section className="bg-gray-800/70 rounded-2xl p-8 max-w-3xl mx-auto my-2 shadow-md text-center shadow-blue-200 space-y-4">
            <p className="text-blue-200 leading-relaxed">
              Lunar is free to use — but it isn’t free to build or maintain. If
              you find value in Lunar, consider supporting the project by
              donating.
            </p>

            <p className="text-blue-200 leading-relaxed">
              Ads help cover operational costs so core features stay free. Your
              support helps us continue improving the platform.
            </p>
            <p className="text-amber-100 font-serif">
              Thank you for being part of our community.
            </p>
          </section>

          {/* QUOTE SECTION */}
          <section className="bg-gray-800/70 rounded-2xl p-6 max-w-xl mx-auto mt-1 text-center shadow-md shadow-blue-200 animate-fadeIn">
            <h3 className="text-xl md:text-2xl font-serif text-amber-100">
              {quote[random]?.text}
            </h3>
            <p className="italic mt-0 text-blue-200">
              — {quote[random]?.author}
            </p>
          </section>
        </div>
      )}
    </>
  );
}
