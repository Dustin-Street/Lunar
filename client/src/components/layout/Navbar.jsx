import { Navigate, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFlashMessage } from "../context/FlashMessageContext";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState();
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  useEffect(() => {
    function updateProfileImage() {
      setUserProfileImage(user?.profile?.profileImage);
    }
    updateProfileImage();
  }, [user]);

  const LogoutMessage = () => {
    logout();
    navigate("/");
    setFlashMessage("You have been logged out successfully ");
  };

  return (
    <div className="sticky top-0 z-60 rounded-xs border-0 border-b-blue-950 space-y-0 hover:shadow-md shadow-blue-200">
      <nav className="bg-gray-700 opacity-96 border-b-5 shadow-2xl border-b-blue-300">
        {/* Desktop & Mobile Header */}
        <div className="flex items-center justify-between py-2">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <NavLink to="/" id="navlink" className="inline-block">
              <img
                className="max-w-8 ms-5 me-5 "
                src="images/LunarLogo.svg"
                alt=""
              />
            </NavLink>
            <NavLink className="inline-block align-top" to="/">
              <h1 className="bg-linear-to-r from-blue-200 to-amber-100 bg-clip-text text-transparent text-2xl md:text-2xl lg:text-2xl font-bold text-shadow-bold shadow-2xl hover:saturate-400 hover:translate-y-0.5">
                Lunar
              </h1>
            </NavLink>
          </div>

          {/* Desktop Navigation - Hidden on Mobile */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center rounded-4xl my-1">
              <NavLink
                to="/journalSelect"
                id="navlink"
                className="absolute top-2 lg:right-49/100 md:right:1/2 inline-block"
              >
                <h2 className="text-blue-300 text-[1.2em] text-shadow-bold shadow-2xl hover:text-blue-400 hover:translate-y-0.5">
                  Journal
                </h2>
              </NavLink>
            </div>
          )}

          {/* Desktop Auth - Hidden on Mobile */}
          <div className="hidden md:flex items-center border-s-5 border-yellow-100 rounded-4xl my-1">
            {!isAuthenticated && (
              <>
                <NavLink
                  to="/signup"
                  id="navlink"
                  className="mx-9 inline-block"
                >
                  <h2 className="text-blue-300 text-[1.2em] text-shadow-bold shadow-2xl hover:text-blue-400 hover:translate-y-0.5">
                    Signup
                  </h2>
                </NavLink>
                <NavLink to="/login" id="navlink" className="me-9 inline-block">
                  <h2 className="text-blue-300 text-[1.2em] text-shadow-bold shadow-2xl hover:text-blue-400 hover:translate-y-0.5">
                    Login
                  </h2>
                </NavLink>
              </>
            )}
            {isAuthenticated && user && (
              <>
                <NavLink
                  to="/account"
                  className="text-blue-300 text-[1.2em] text-shadow-bold shadow-2xl me-5 ms-5 inline-block align-middle  hover:translate-y-0.5 hover:text-blue-400"
                >
                  {user.username}
                </NavLink>
                <button
                  onClick={LogoutMessage}
                  id="navlink"
                  className="me-9 inline-block bg-transparent border-0 p-0 ms-5 cursor-pointer"
                >
                  <h2 className="text-blue-300 text-[1.2em] text-shadow-bold shadow-2xl hover:text-blue-400 hover:translate-y-0.5">
                    Logout
                  </h2>
                </button>
              </>
            )}
            {/* Hamburger Menu Button - Visible on Mobile Only or small screens */}
          </div>
          {isAuthenticated && (
            <div className="md:hidden overflow-hidden transition-all duration-300 ease-in-out align items-center flex">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-blue-300 hover:text-blue-400 focus:outline-none me-5"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          )}
          {!isAuthenticated && (
            <div className="md:hidden overflow-hidden transition-all duration-300 ease-in-out">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-blue-300 hover:text-blue-400 focus:outline-none me-5"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Tray - Collapsible */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-5 space-y-6 mt-0 bg-gray-800 border-t border-blue-300 justify-items-center">
            {!isAuthenticated && (
              <>
                <NavLink
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  id="navlink"
                  className="block  shadow-blue-200 px-4 py-3 bg-transparent rounded-2xl group"
                >
                  <h2 className="text-amber-100 text-[1.2em] text-shadow-bold shadow-2xl group-hover:text-amber-200 hover:translate-y-0.5">
                    Signup
                  </h2>
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  id="navlink"
                  className="block  shadow-blue-200 px-4 py-3 bg-transparent rounded-2xl group"
                >
                  <h2 className="text-amber-100 text-[1.2em] text-shadow-bold shadow-2xl group-hover:text-amber-200 hover:translate-y-0.5">
                    Login
                  </h2>
                </NavLink>

                <NavLink
                  to="/app-policy"
                  onClick={() => setIsMenuOpen(false)}
                  id="navlink"
                  className="block  shadow-blue-200 px-4 py-3 bg-transparent rounded-2xl group"
                >
                  <h2 className="text-amber-100 text-[1.2em] text-shadow-bold shadow-2xl group-hover:text-amber-200 hover:translate-y-0.5 mb-4">
                    App Policy
                  </h2>
                </NavLink>
              </>
            )}

            {isAuthenticated && (
              <div className="px-5 space-y-6 mt-0 mb-3 bg-gray-800 border-t border-blue-300 justify-items-center">
                <NavLink
                  to="/journalSelect"
                  onClick={() => setIsMenuOpen(false)}
                  id="navlink"
                  className="block px-4 py-3 bg-transparent rounded-2xl shadow-blue-200 group translate-y-0.5"
                >
                  <h2 className="text-amber-100 text-[1.2em] text-shadow-bold shadow-2xl group-hover:text-amber-200 hover:translate-y-0.5">
                    Journal
                  </h2>
                </NavLink>
                <NavLink
                  to="/Account"
                  onClick={() => setIsMenuOpen(false)}
                  id="navlink"
                  className="block px-4 py-3 bg-transparent rounded-2xl shadow-blue-200 group translate-y-0.5"
                >
                  <h2 className="text-amber-100 text-[1.2em] text-shadow-bold shadow-2xl group-hover:text-amber-200 hover:translate-y-0.5">
                    Account
                  </h2>
                </NavLink>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    LogoutMessage();
                  }}
                  id="navlink"
                  className="block  shadow-blue-200 px-4 py-3 bg-transparent rounded-2xl group"
                >
                  {" "}
                  <h2 className="text-amber-100 text-[1.2em] text-shadow-bold shadow-2xl group-hover:text-amber-200 hover:translate-y-0.5">
                    Logout
                  </h2>
                </button>
                <NavLink
                  to="/app-policy"
                  onClick={() => setIsMenuOpen(false)}
                  id="navlink"
                  className="block px-4 py-3 bg-transparent rounded-2xl shadow-blue-200 group translate-y-0.5"
                >
                  <h2 className="text-amber-100 text-[1.2em] text-shadow-bold shadow-2xl group-hover:text-amber-200 hover:translate-y-0.5">
                    App Policy
                  </h2>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
