import { useEffect, useState } from "react"
import './Home.css'

import { useOutletContext } from 'react-router-dom'


export default function Home() {
  const [quote, setQuote] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getInitialQuote() {
      try {
        const response = await fetch("http://localhost:5050/quotes/quote");
        const data = await response.json();
        setQuote(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
    getInitialQuote();
  }, []);

  const random = quote.length
    ? Math.floor(Math.random() * quote.length)
    : 0;

  return (
    <div className="min-h-screen bg-[url(/images/booksUpscale2)] bg-cover bg-center px-4 py-8 flex flex-col gap-8 items-center">

      {/* Intro */}
      <div className="bg-gray-700/60 rounded-2xl p-6 max-w-3xl text-center text-white shadow-lg shadow-blue-200">
        <h3 className="text-lg md:text-2xl lg:text-3xl text-amber-100 font-serif text-center">
          Insight is a simple journaling application where customization and the user come first.
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
