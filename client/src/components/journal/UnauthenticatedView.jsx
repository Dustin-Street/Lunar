import { useNavigate } from 'react-router-dom';

/**
 * View shown to unauthenticated users
 * Prompts them to sign up or log in
 */
export default function UnauthenticatedView({ isLoading = false }) {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="grid items-center min-h-screen px-4 bg-[url(images/mountains1.png)] bg-no-repeat bg-cover">
                <div className="text-amber-100 text-center border-4 border-blue-200 rounded-lg p-10 max-w-md justify-self-center bg-linear-to-r from-gray-600 via-gray-700 to-gray-900">
                    <h1 className="text-2xl">Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="grid items-center min-h-screen px-4 bg-[url(images/mountains.png)] bg-no-repeat bg-cover gap-10 position-fixed">
            <div className="text-amber-100 text-center border-4 border-blue-200 rounded-lg p-10 max-w-md justify-self-center bg-linear-to-r from-gray-600 via-gray-700 to-gray-900">
                <h1 className="md:text-3xl sm:text-2xl">
                    Create an account to get started or log in if you already have an account
                </h1>
                <button 
                    onClick={() => navigate('/signup')} 
                    className="m-5 mt-5 border-2 border-blue-200 rounded-md py-2 px-4 bg-gray-700 hover:bg-blue-500 hover:cursor-pointer hover:shadow-lg shadow-blue-500"
                >
                    Sign Up
                </button>
                <button 
                    onClick={() => navigate('/login')} 
                    className="m-5 mt-5 border-2 border-blue-200 rounded-md py-2 px-4 bg-gray-700 hover:bg-blue-500 hover:cursor-pointer hover:shadow-lg shadow-blue-500"
                >
                    Log In
                </button>
            </div>
        </div>
    );
}
