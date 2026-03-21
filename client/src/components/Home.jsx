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
      <div className="bg-gray-700 rounded-2xl p-6 max-w-3xl text-center text-white shadow-sm shadow-blue-200">
        <h3 className="text-lg md:text-2xl lg:text-3xl text-amber-100 font-serif text-center animate-fadeIn">
          Lunar in a Journaling application where you can reflect on your day.
          This is a Beta or prototype, and is not intended to be viewed as a
          final product. Still in early development, and a work in progress. We
          hope you enjoy using it, and we welcome any feedback you may have.
        </h3>
      </div>

      <div>
        <h2 className=" bg-gray-700 rounded-2xl p-6 max-w-2xl text-center text-amber-100 shadow-sm shadow-blue-200 animate-fadeIn md:text-xl lg:text-2xl font-serif md:w-full">
          <span className="text-amber-200">Key Features: </span>
          <br />
          <ul>
            <li className="mt-2">Daily journaling with mood tracking</li>
            <li className="mt-2">
              Optional - AI-powered insights and analytics companion
            </li>
            {/* <li className="mt-2">Customizable themes and layouts</li> */}
            <li className="mt-2">Secure and private data storage</li>
          </ul>
        </h2>
      </div>

      <div className=" bg-gray-700 rounded-2xl p-6 max-w-2xl text-center text-amber-100 shadow-sm shadow-blue-200 animate-fadeIn md:text-xl lg:text-2xl font-serif">
        <h2>-- Get Started By signing up Free --</h2>
        <button
          className="p-3 block rounded-2xl border-3 justify-self-center border-blue-200 bg-blue-300 hover:text-yellow-200 hover:border-amber-200 hover:bg-blue-200 hover:shadow-lg transform hover:-translate-y-px hover:shadow-cyan-100 mt-4"
          onClick={() => {
            window.location.href = "/signup";
          }}
        >
          Signup
        </button>
        <h1 className="border-t-2 m-4 pt-4">Already have an account?</h1>
        <button
          className="p-3 block rounded-2xl border-3 justify-self-center border-blue-200 bg-blue-300 hover:text-yellow-200 hover:border-amber-200 hover:bg-blue-200 hover:shadow-lg transform hover:-translate-y-px hover:shadow-cyan-100"
          onClick={() => {
            window.location.href = "/login";
          }}
        >
          Login
        </button>
      </div>

      {/* Quote */}
      <div className="bg-gray-700 rounded-2xl p-6 max-w-2xl text-center text-white mt-auto mb-8 shadow-sm shadow-blue-200 animate-fadeIn">
        {loading ? (
          <span className="text-lg font-serif ">Loading…</span>
        ) : (
          <>
            <h3 className="text-lg md:text-xl lg:text-2xl font-serif text-amber-100">
              {quote[random]?.text}
            </h3>
            <h5 className="italic mt-3 text-sm md:text-base text-blue-200 ">
              — {quote[random]?.author}
            </h5>
          </>
        )}
      </div>
    </div>
  );
}
