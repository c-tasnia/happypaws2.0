import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import DonationPage from "../pages/donation/DonationPage";
import PaymentSuccess from '../pages/donation/PaymentSuccess';
import PaymentFail from '../pages/donation/PaymentFail';
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import Volunteer from "../pages/Volunteer/Volunteer";
import PetsPage from "../pages/PetsPage";
import AdminDashboard from "../pages/admin/AdminDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "donations", element: <DonationPage /> },
      { path: "payment/success", element: <PaymentSuccess /> },
      { path: "payment/fail", element: <PaymentFail /> },
      { path: "volunteer", element: <Volunteer /> },
      { path: "pets", element: <PetsPage /> },
      { path: "admin", element: <AdminDashboard /> },
    ],
  },
]);

export default router;