import "./App.css";
import {
  FlashMessageProvider,
  useFlashMessage,
} from "./components/context/FlashMessageContext";
import FlashMessage from "./components/layout/FlashMessage";
import Footer from "./components/layout/footer";
import Navbar from "./components/layout/Navbar";
import { Outlet } from "react-router-dom";

function AppContent() {
  const {
    message,
    messageId,
    buttonText,
    onClick,
    durationTime,
    getButtonStatus,
  } = useFlashMessage();
  return (
    <>
      <Navbar />
      {message && (
        <div className="fixed top-30 left-1/2 -translate-x-1/2 z-50 w-full sm:max-w-md lg:max-w-lg px-4">
          <FlashMessage
            newMessage={message}
            messageId={messageId}
            buttonNeeded={getButtonStatus()}
            buttonText={buttonText}
            onClick={onClick}
            duration={durationTime}
          />
        </div>
      )}
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
