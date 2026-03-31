import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const FlashMessageContext = createContext(null);

export const FlashMessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [messageId, setMessageId] = useState(0);
  const [durationTime, setDurationTime] = useState(3000);
  const [buttonText, setButtonText] = useState("Click Me");
  const [showButton, setShowButton] = useState(false);
  const [onClick, setOnClick] = useState(() => {});

  /**
   * Toggles the flash message button and configures its behavior.
   * @param {boolean} buttonNeeded - Whether the button should be shown.
   * @param {string} [buttonText="Click Me"] - Text displayed on the button.
   * @param {function} [onClick=()=>{}] - Handler for button click.
   */
  const setToggleButton = useCallback((buttonNeeded, buttonText = "Click Me", onClick = () => {}) => {
    setShowButton(buttonNeeded);
    setButtonText(buttonText);
    setOnClick(() => onClick);
  }, []);

  /**
   * Sets how long the flash message stays visible.
   * @param {number} time - Duration in milliseconds.
   */
  const setDuration = useCallback((time) => {
    setDurationTime(time);
  }, []);

  /**
   * Returns whether the flash message button is currently enabled.
   * @returns {boolean}
   */
  const getButtonStatus = useCallback(() => {
    return showButton;
  }, [showButton]);

  /**
   * Sets the flash message text.
   * @param {string} text - Message to display.
   */
  const setFlashMessage = useCallback((text) => {
    setMessage(text);
    setMessageId(prev => prev + 1);
  }, []);

  /**
   * Clears the flash message and resets all button/duration settings.
   */
  const clearFlashMessage = useCallback(() => {
    setMessage(null);
    setShowButton(false);
    setButtonText("Click Me");
    setOnClick(() => {});
    setDurationTime(3000);
  }, []);

  const contextValue = useMemo(
    () => ({
      message,
      messageId,
      setFlashMessage,
      clearFlashMessage,
      setToggleButton,
      getButtonStatus,
      buttonText,
      onClick,
      durationTime,
      setDuration,
    }),
    [
      message,
      messageId,
      setFlashMessage,
      clearFlashMessage,
      setToggleButton,
      getButtonStatus,
      buttonText,
      onClick,
      durationTime,
      setDuration,
    ]
  );

  return (
    <FlashMessageContext.Provider value={contextValue}>
      {children}
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessage = () => useContext(FlashMessageContext);