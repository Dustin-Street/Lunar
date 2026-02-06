import { createContext, useContext, useState, useCallback, useMemo } from 'react';


const FlashMessageContext = createContext(null);

export const FlashMessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [durationTime, setDurationTime] = useState(3000);
  const [buttonText, setButtonText] = useState("Click Me");
  const [showButton, setShowButton] = useState(false);
  const [onClick, setOnClick] = useState(() => { });


  const setToggleButton = useCallback((buttonNeeded, buttonText = "Click Me", onClick = () => { }) => {
    /**
     * @param {boolean} buttonNeeded - Whether to show the button
     * @param {string} buttonText - Text to display on the button
     * @param {function} onClick - Click handler function
     */
    setShowButton(buttonNeeded);
    setButtonText(buttonText);
    setOnClick(() => onClick);
  }, []);

  const setDuration = useCallback((time) => {
    /**
     * @param {number} time - Duration in milliseconds
     */
    setDurationTime(time);
  }, []);

  const getButtonStatus = useCallback(() => {
    /** 
     * @returns {boolean} - Returns whether the button should be shown
     */
    return showButton;
  }, [showButton]);

  const setFlashMessage = useCallback((text) => {
    /**
     * @param {string} text - The message text to display
     */
    setMessage(text);
  }, []);

  const clearFlashMessage = useCallback(() => {
    /**
     * Clears the current flash message
     */
    setMessage(null);
    setShowButton(false);
    setButtonText("Click Me");
    setOnClick(() => {});
    setDurationTime(3000);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    message, 
    setFlashMessage, 
    clearFlashMessage, 
    setToggleButton, 
    getButtonStatus, 
    buttonText, 
    onClick, 
    durationTime, 
    setDuration
  }), [message, setFlashMessage, clearFlashMessage, setToggleButton, getButtonStatus, buttonText, onClick, durationTime, setDuration]);

  return (
    <FlashMessageContext.Provider value={contextValue}>
      {children}
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessage = () => useContext(FlashMessageContext);