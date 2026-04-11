import { useEffect, useState } from "react";

/**
 * @param message : the message to display
 * @param duration : how long before the card disappears
 */
export default function VerifiySubmition({
  message = "request submitted, watch for an email verification for any next steps",
  duration = 3000,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      name="VerifySumbitionCard"
      className="w-full h-3/4 border-2 border-blue-200 bg-gray-700 text-amber-100"
    >
      <div>
        {message}
        <img src="CheckMark.png" alt="" />
      </div>
    </div>
  );
}