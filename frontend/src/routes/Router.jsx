import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import DonationPage from "../pages/DonationPage";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFail from "../pages/PaymentFail";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, // Master Parent (manages Toast state)
        children: [
            {
                path: "/",
                element: <Home />, // Layout Parent (manages Navbar)
                children: [
                    {
                        index: true,
                        element: <DonationPage />,
                    },
                    {
                        path: "login",
                        element: <Login />,
                    },
                    {
                        path: "register",
                        element: <Register />,
                    },
                    {
                        path: "payment/success",
                        element: <PaymentSuccess />,
                    },
                    {
                        path: "payment/fail",
                        element: <PaymentFail />,
                    },
                ],
            },
        ],
    },
]);

export default router;