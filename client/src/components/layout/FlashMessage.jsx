

import { useEffect, useState } from "react";

export default function FlashMessage({ newMessage, duration = 3000, buttonNeeded = false, buttonText = "Click Me", onClick = () => { } }) {
    const [visible, setVisible] = useState(false);
    const [dynamicImage, setDynamicImage] = useState(null);
    const [buttonVisible, setButtonVisible] = useState(buttonNeeded);

    // Array of chibi character images
    const chibiImages = [

        "images/messageImage1.png",
        // Add more image paths as needed
    ];

    useEffect(() => {
        if (!newMessage) return;

        setVisible(true);
        setButtonVisible(buttonNeeded);
        

        // Randomly select a chibi image
        const randomImage = chibiImages[Math.floor(Math.random() * chibiImages.length)];
        setDynamicImage(randomImage);

        const hideTimer = setTimeout(() => {
            setVisible(false);
            setDynamicImage(null);
            setButtonVisible(false);

        }, duration);

        


        return () => clearTimeout(hideTimer);
    }, [newMessage, duration, buttonNeeded]);


    return (
        <div
            className={`
        pointer-events-none
        transition-all duration-300 ease-out
        ${visible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-2 scale-95"}
      `}
        >
            <div className="rounded-xl bg-gray-600 border-4 border-blue-200 px-5 py-3 text-amber-100 shadow-xl backdrop-blur flex items-center gap-3">
                <span className="text-center flex-1">{newMessage}</span>
                <span className="inline ml-4 bg-red-400 text-white px-3 py-1 rounded-full cursor-pointer pointer-events-auto">
                    {buttonVisible && <button onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                        setVisible(false);
                    }} >{buttonText}</button>}</span>

                {// in Development: add dynamic images later
                }
                {/* {dynamicImage && (
                    <img
                        src={dynamicImage}
                        alt="message character"
                        className="w-24 h-24 shrink-0 bg-gray-600 rounded-full p-1 border-2 border-blue-200"
                    />
                )} */}
            </div>
        </div>
    );
}