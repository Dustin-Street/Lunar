import { useEffect, useState } from "react";
import "./Home.css";
import { useAuth } from "./context/AuthContext";
import LoginSignupCard from "./layout/LoginSignupCard";
import UserOverviewCard from "./layout/UserOverviewCard";
import LoudingOverlay from "./layout/LoadingOverlay";
import { API_BASE_URL } from "../utils/api";
import LoadingOverlay from "./layout/LoadingOverlay";

export default function Home() {
  const [quote, setQuote] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    async function getInitialQuote() {
      try {
        const response = await fetch(`${API_BASE_URL}/quotes/quote`);
        const data = await response.json();
        setQuote(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
    getInitialQuote();
  }, []);

  const random = quote.length ? Math.floor(Math.random() * quote.length) : 0;

  return (
    <>
      {loading ? (
        <div className="min-h-screen bg-[url(/images/crecentToFull.jpg)] bg-cover bg-center px-4 py-8 flex items-center justify-center">
          <LoadingOverlay />
        </div>
      ) : (
        <div className="min-h-screen bg-[url(/images/crecentToFull.jpg)] bg-cover bg-center px-4 py-8 flex flex-col gap-8 items-center">
          {/* Intro Card */}
          <div className="bg-gray-700/78 rounded-2xl p-6 max-w-3xl text-center text-white shadow-sm shadow-blue-200">
            <h3 className="text-lg md:text-2xl lg:text-3xl text-amber-100 font-serif animate-fadeIn">
              Lunar is a journaling application where you can reflect on your
              day. This is a Beta or prototype, and is not intended to be viewed
              as a final product. Still in early development, and a work in
              progress. We hope you enjoy using it, and we welcome any feedback
              you may have.
            </h3>
          </div>

          {/* Features */}
          <div>
            <h2 className="bg-gray-700/78 rounded-2xl p-6 max-w-2xl text-center text-amber-100 shadow-sm shadow-blue-200 animate-fadeIn md:text-xl lg:text-2xl font-serif md:w-full">
              <span className="text-amber-200">Key Features:</span>
              <br />
              <ul>
                <li className="mt-2">Daily journaling with mood tracking</li>
                <li className="mt-2">
                  Optional - AI-powered insights and analytics companion
                </li>
                <li className="mt-2">Secure and private data storage</li>
              </ul>
            </h2>
          </div>

          {/* Auth or User Card */}
          {!isAuthenticated ? (
            <LoginSignupCard />
          ) : (
            <UserOverviewCard user={user} />
          )}

          {/* Quote */}
          <div className="bg-gray-700/78 rounded-2xl p-6 max-w-2xl text-center text-white mt-auto mb-8 shadow-sm shadow-blue-200 animate-fadeIn">
            {loading ? (
              <span className="text-lg font-serif">Loading…</span>
            ) : (
              <div className="flex flex-col items-center">
                <h3 className="text-lg md:text-xl lg:text-2xl font-serif text-amber-100 m-2">
                  {quote[random]?.text}
                </h3>
                <h5 className="italic mt-3 text-sm md:text-base font-serif text-blue-200">
                  — {quote[random]?.author}
                </h5>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
