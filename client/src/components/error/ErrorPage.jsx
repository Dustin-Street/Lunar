import { useState } from "react";

export default function ErrorPage({ error }) {
  const [errorinfo, setErrorinfo] = useState({
    error: error,
    errorImage: "/images/errorImage.jpg",
  });
  if (error.statusCode === 404) {
    errorinfo.errorImage = "/images/404error.jpg";
  }
  return (
    <div className="justify-items-center justify-self-center h-screen w-full bg-neutral-100  flex flex-col items-center border-2 bg-[url('images/deepnight3.jpg')] py-10">
      <h1 className="text-sm md:text-2xl lg:text-3xl font-bold mb-2 mt-24 text-blue-200 ">
        Something went wrong.
      </h1>
      <span className="text-center text-sm md:text-2xl lg:text-3xl text-amber-100">
        {error && <p>{error.message}</p>}{" "}
        {error && error.statusCode && <p>Status Code: {error.statusCode}</p>}
        {error && (
          <img
            src={errorinfo.errorImage}
            className="border-6 mt-12 rounded-4xl shadow-lg"
            alt=""
          />
        )}
      </span>
    </div>
  );
}
