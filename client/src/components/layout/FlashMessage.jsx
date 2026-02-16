/**
 * FlashMessage component
 *
 * @param {Object} props
 * @param {string} props.newMessage - The message text to display.
 * @param {number} [props.duration=3000] - How long the message stays visible (ms).
 * @param {boolean} [props.buttonNeeded=false] - Whether to show action buttons.
 * @param {string} [props.buttonText="Click Me"] - Text for the primary action button.
 * @param {Function} [props.onClick] - Callback when the primary button is clicked.
 * @param {Function} [props.onCancel] - Callback when cancel is clicked.
 */

import { useEffect, useState } from "react";

export default function FlashMessage({
    newMessage,
    duration = 3000,
    buttonNeeded = false,
    buttonText = "Click Me",
    onClick = () => {},
    onCancel = () => {}
}) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!newMessage) return;

        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [newMessage, duration]);

    const handleCancel = () => {
        setVisible(false);
        onCancel();
    };

    return (
        <div
            className={`
                pointer-events-none
                transition-all duration-300 ease-out
                ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"}
            `}
        >
            <div className="rounded-xl bg-gray-600 border-4 border-blue-200 px-5 py-3 text-amber-100 shadow-xl backdrop-blur flex items-center gap-3">
                
                <span className="text-center flex-1">{newMessage}</span>

                {buttonNeeded && (
                    <div className="flex gap-2 pointer-events-auto">
                        <button
                            className="h-8 bg-red-400 text-white px-3 py-1 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick();
                                setVisible(false);
                            }}
                        >
                            {buttonText}
                        </button>

                        <button
                            className="h-8 bg-gray-500 text-white px-3 py-1 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancel();
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}