import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import DonationPage from "../pages/DonationPage";
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentFail from '../pages/PaymentFail';
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, 
        element: <Home /> },
      { path: "login", 
        element: <Login /> },
      { path: "register", 
        element: <Register /> },
      { path: "donations", 
        element: <DonationPage /> },
      { path: "payment/success", 
        element: <PaymentSuccess /> },
      { path: "payment/fail", 
        element: <PaymentFail /> },
    ],
  },
]);

export default router;