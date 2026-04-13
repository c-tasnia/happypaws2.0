import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import DonationPage from "../pages/donation/DonationPage";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import PaymentSuccess from "../pages/donation/PaymentSuccess";
import PaymentFail from "../pages/donation/PaymentFail";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "donations",
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
]);

export default router;