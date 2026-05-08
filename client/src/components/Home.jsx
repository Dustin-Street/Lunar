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

  //temp
  const { setFlashMessage } = useFlashMessage();
  const { user, isAuthenticated, accessToken } = useAuth();

  //Quote

  useEffect(() => {
    async function getInitialQuote() {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/quotes/quote`, {
          withCredentials: true,
        });
        setQuote(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getInitialQuote();
  }, []);

  const random = quote.length ? Math.floor(Math.random() * quote.length) : 0;

  //request updated user information to get virtual hasStatistics and the user to use statistics

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
        setStatistics(response.data);
      } catch (error) {
        console.error(error);
        setFlashMessage("error receiving your Activity report");
      } finally {
        setLoading(false);
        setLoadingStats(false);
      }
    }
    updateAndGetUserStatistics();
  }, [accessToken, setFlashMessage]);

  return (
    <div>
      <img
        src="/images/deepnight3.webp"
        alt=""
        fetchPriority="high"
        className="hidden"
      />
      <div className="h-dvh flex lg:h-screen bg-[url('/images/deepnight3.webp')] bg-center bg-no-repeat items-center justify-center ">
        {loading ? (
          <div className=" flex items-center justify-center">
            <LoadingOverlay />
          </div>
        ) : (
          <div className=" text-white">
            {/* HERO SECTION */}

            <div className="bg-gray-800/70  md:rounded-2xl pt-90 md:pt-0 p-8 max-w-3xl mx-0 lg:my-4 mb-0 max-h-screen md:max-h-200 h-screen w-screen sm:h-3/4 shadow-md shadow-amber-100 space-y-2">
              <section className="flex flex-col items-center text-center ">
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
              <section className="text-center">
                {" "}
                <h3 className="text-sm md:text-lg font-serif text-amber-100">
                  {quote[random]?.text}
                </h3>
                <p className="italic text-xs md:text mt-0 text-blue-200">
                  — {quote[random]?.author}
                </p>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
