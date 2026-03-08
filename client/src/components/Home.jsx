import { useEffect, useState } from "react";
import "./Home.css";

import { useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

export default function Home() {
  const [quote, setQuote] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-[url(/images/deepnight2.jpg)] bg-cover bg-center px-4 py-8 flex flex-col gap-8 items-center">
      <div className="bg-gray-700/60 rounded-2xl p-6 max-w-3xl text-center text-white shadow-lg shadow-blue-200">
        <h3 className="text-lg md:text-2xl lg:text-3xl text-amber-100 font-serif text-center">
          Lunarsight in a Journaling application where you can reflect on your
          day. This is a Beta or prototype, and is not intended to be viewed as
          a final product. We are still in early development, and we are working
          hard to make it the best it can be. We hope you enjoy using it, and we
          welcome any feedback you may have.
        </h3>
      </div>

      {/* Quote */}
      <div className="bg-gray-800/60 rounded-2xl p-6 max-w-2xl text-center text-white mt-auto mb-8">
        {loading ? (
          <span className="text-lg font-serif ">Loading…</span>
        ) : (
          <>
            <h3 className="text-lg md:text-xl lg:text-2xl font-serif">
              {quote[random]?.text}
            </h3>
            <h5 className="italic mt-3 text-sm md:text-base">
              — {quote[random]?.author}
            </h5>
          </>
        )}
      </div>
    </div>
  );
}
