import { useState } from "react";

export default function ErrorPage({error}) {
    const [errorinfo, setErrorinfo] = useState({error: error, errorImage: '/images/errorImage.jpg', });
    if(error.statusCode === 404){
        errorinfo.errorImage = '/images/404error.jpg';
    }
    return(
        <div className="justify-items-center justify-self-center h-dvh w-full bg-neutral-100  flex flex-col items-center border-2">
            <h1 className="text-3xl font-bold mb-2 mt-24 ">Something went wrong.</h1>
            {error && <p>{error.message}</p>} {error && error.statusCode && <p>Status Code: {error.statusCode}</p>}
            {error.statusCode === 404 && (
                <p className="mt-4">The page you are looking for does not exist. Please check the URL or return to the home page.</p>

            )}
            {error &&  (
                <img src={errorinfo.errorImage} className="border-6 mt-12 rounded-4xl shadow-lg" alt="" />
            )}
        </div>
    )
}
