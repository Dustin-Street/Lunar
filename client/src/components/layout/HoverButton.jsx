import { useState } from "react";

export default function HoverButton({
  colorBefore = "blue-500",
  colorAfter = "white",
  buttonText = "Click Me",
  onClick = () => {},
  position = "center", // 'left', 'center', 'right'
  transform = "leftToRight",
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case "left":
        return "left-0 rounded-tr-lg";
      case "right":
        return "right-0 rounded-tl-lg";
      case "top":
        return "top-0 rounded-b-xl transform -translate-x-1/2";
      case "top-left":
        return "top-0 left-0 rounded-b-xl";
      case "top-right":
        return "top-0 right-0 rounded-b-xl";
      case "center":
      default:
        return "left-1/2 transform -translate-x-1/2";
    }
  };

  const transformClasses = () => {
    switch (transform) {
      case "leftToRight":
        return;
    }
  };

  // Convert Tailwind color names to CSS values
  const colorMap = {
    "red-400": "#f87171",
    "green-400": "#34d399",
    white: "#ffffff",
    "gray-600": "#4b5563",
    "gray-50": "#f9fafb",
    "gray-100": "#f3f4f6",
    "gray-200": "#e5e7eb",
    "gray-300": "#d1d5db",
    "gray-400": "#9ca3af",
    "gray-500": "#6b7280",
    "gray-600": "#4b5563",
    "gray-700": "#374151",
    "gray-800": "#1f2937",
    "gray-900": "#111827",
    "gray-950": "#030712",

    "yellow-50": "#fefce8",
    "yellow-100": "#fef9c3",
    "yellow-200": "#fef08a",
    "yellow-300": "#fde047",
    "yellow-400": "#facc15",
    "yellow-500": "#eab308",
    "yellow-600": "#ca8a04",
    "yellow-700": "#a16207",
    "yellow-800": "#854d0e",
    "yellow-900": "#713f12",
    "yellow-950": "#422006",

    "blue-50": "#eff6ff",
    "blue-100": "#dbeafe",
    "blue-200": "#bfdbfe",
    "blue-300": "#93c5fd",
    "blue-400": "#60a5fa",
    "blue-500": "#3b82f6",
    "blue-600": "#2563eb",
    "blue-700": "#1d4ed8",
    "blue-800": "#1e40af",
    "blue-900": "#1e3a8a",
    "blue-950": "#172554",
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
                    h-14 w-1/2
                    ${isHovered ? "translate-y-0" : "translate-y-0.5"}
                    
                `}
      >
        <div
          className={`
                    flex 
                    justify-center
                    items-center 
                    h-full 
                    transition-opacity 
                    duration-200
                    opacity-100
                    md:${isHovered ? "opacity-100" : "opacity-0"}
                `}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            style={{ backgroundColor: bgColor, color: textColor }}
            className="p-20 text-sm md:text-base rounded-lg hover:opacity-80 active:opacity-70 font-semibold transition-opacity touch-manipulation"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
