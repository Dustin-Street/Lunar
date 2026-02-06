import { useState } from 'react';

export default function HoverButton({ 
    colorBefore = 'blue-500', 
    colorAfter = 'white',
    buttonText = 'Click Me',
    onClick = () => {},
    position = 'center' // 'left', 'center', 'right'
}) {
    const [isHovered, setIsHovered] = useState(false);

    const getPositionClasses = () => {
        switch(position) {
            case 'left':
                return 'left-0 rounded-tr-lg';
            case 'right':
                return 'right-0 rounded-tl-lg';
            case 'center':
            default:
                return 'left-1/2 transform -translate-x-1/2';
        }
    };

    // Convert Tailwind color names to CSS values
    const colorMap = {
        'red-400': '#f87171',
        'blue-400': '#60a5fa',
        'blue-500': '#3b82f6',
        'white': '#ffffff'
    };

    const bgColor = colorMap[colorBefore] || colorBefore;
    const textColor = colorMap[colorAfter] || colorAfter;

    // Handle both hover and touch events
    const handleInteractionStart = () => setIsHovered(true);
    const handleInteractionEnd = () => setIsHovered(false);

    return (
        <div 
            onMouseEnter={handleInteractionStart} 
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
        >
            <div 
                style={{ backgroundColor: bgColor }}
                className={`
                    absolute
                    bottom-0 
                    ${getPositionClasses()}
                    rounded-t-lg 
                    shadow-lg 
                    transition-all 
                    duration-300 
                    ease-in-out
                    overflow-hidden
                    cursor-pointer
                    h-16 w-32
                    md:${isHovered ? 'h-12 w-40' : 'h-4 w-24'}
                `}
            >
                <div className={`
                    flex 
                    justify-center
                    items-center 
                    h-full 
                    transition-opacity 
                    duration-200
                    opacity-100
                    md:${isHovered ? 'opacity-100' : 'opacity-0'}
                `}>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        style={{ backgroundColor: bgColor, color: textColor }}
                        className="px-4 py-2 text-sm md:text-base rounded-lg hover:opacity-80 active:opacity-70 font-semibold transition-opacity touch-manipulation"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}