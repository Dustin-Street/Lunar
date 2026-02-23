import { useState, useCallback } from "react";

/**
 * Reusable form component for creating new journals
 * Handles its own title state and validation
 */
export default function JournalCreateForm({ onSubmit, className = "" }) {
    const [title, setTitle] = useState('');
    const [showError, setShowError] = useState(false);

    // Memoize submit handler to prevent recreation on every render
    const handleSubmit = useCallback(async () => {
        if (title.trim() === '') {
            setShowError(true);
            return;
        }

        const success = await onSubmit(title);
        if (success) {
            setTitle(''); // Clear form on success
            setShowError(false);
        } else {
            setShowError(true);
        }
    }, [title, onSubmit]);

    // Handle Enter key within form context only
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className={`grid text-center place-items-center group border-4 border-blue-200 bg-linear-to-r from-gray-600 via-gray-700 to-gray-900 px-12 py-40 text-amber-100 font-medium rounded-lg w-full max-w-xs sm:max-w-sm ${className}`}>
            <input
                name="title"
                type="text"
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                    setShowError(false);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Journal Title"
                className={`
                    bg-neutral-100 rounded-lg mb-4 px-4 py-2 text-black text-center 
                    w-full outline-none transition-all duration-300
                    ${showError
                        ? 'border-4 border-red-500 animate-pulse'
                        : 'border-2 border-transparent focus:border-blue-400'}
                `}
            />
            <h3 className="mb-6 text-lg sm:text-xl">Create New Journal</h3>
            <button
                onClick={handleSubmit}
                className="flex flex-col items-center"
            >
                <svg 
                    className="border-transparent hover:border-blue-400 hover:border-4 shadow-2xl shadow-blue-400 rounded-3xl w-16 h-16 sm:w-20 sm:h-20 md:w-25 md:h-25 group-hover:text-blue-300 text-blue-200 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        d="M12 5v14M5 12h14" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    />
                </svg>
            </button>
        </div>
    );
}
