import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

//routes
import JournalSelect from "./components/journal/JournalSelect.jsx";
import JournalOverview from "./components/journal/JournalOverview.jsx";

import Signup from "./components/account/Signup.jsx";
import Home from "./components/Home";
import Login from "./components/account/Login.jsx";
import AppPolicy from "./components/AppPolicy.jsx";
import App from "./App.jsx";
import ErrorPage from "./components/error/ErrorPage.jsx";
import Account from "./components/account/Account.jsx";
import { AuthProvider } from "./components/context/AuthContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/signup",
    element: <App />,
    children: [
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/login",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/app-policy",
    element: <App />,
    children: [
      {
        path: "/app-policy",
        element: <AppPolicy />,
      },
    ],
  },
  {
    path: "/journalSelect",
    element: <App />,
    children: [
      {
        path: "/journalSelect",
        element: <JournalSelect />,
      },
    ],
  },
  {
    path: "/journalOverview",
    element: <App />,
    children: [
      {
        path: ":id",
        element: <JournalOverview />,
      },
    ],
  },
  {
    path: "/Account",
    element: <App />,
    children: [
      {
        path: "/Account",
        element: <Account />,
      },
    ],
  },
  {
    path: "*",
    element: <App />,
    children: [
      {
        path: "*",
        element: (
          <ErrorPage error={{ message: "Page not found", statusCode: 404 }} />
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
