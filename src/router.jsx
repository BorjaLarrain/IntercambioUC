import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import University from "./pages/University";

import Layout from "./components/Layout";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "", element: <App /> },
            { path: "signup", element: <SignUp /> },
            { path: "signin", element: <SignIn /> },
            { path: "universidad/:id", element: <University /> },
            { path: "miperfil", element: <Profile /> }
        ]
    }
]);