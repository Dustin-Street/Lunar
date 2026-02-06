import './App.css'
import { FlashMessageProvider, useFlashMessage, } from './components/context/FlashMessageContext'
import FlashMessage from './components/layout/FlashMessage'
import Navbar from './components/layout/Navbar'
import { Outlet } from 'react-router-dom'


function AppContent() {
  const { message } = useFlashMessage();
  const { buttonText, onClick, durationTime, getButtonStatus } = useFlashMessage();
  return (
    <>
      <Navbar />
      {message && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full sm:max-w-md lg:max-w-lg px-4">
          <FlashMessage newMessage={message} buttonNeeded={getButtonStatus()} buttonText={buttonText} onClick={onClick} duration={durationTime} />
        </div>
      )}
      <Outlet />
    </>
  );
}

function App() {
  return (
    <FlashMessageProvider>
      <AppContent />
    </FlashMessageProvider>
  )
}

export default App
