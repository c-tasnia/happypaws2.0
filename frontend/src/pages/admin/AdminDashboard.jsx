import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";

import PetsTab from "./PetsTab";
import DonationsTab from "./DonationsTab";
import VolunteersTab from "./VolunteersTab";
import BlogTab from "./BlogTab";

const LOGO = "/LOGO1.png";

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const context = useOutletContext();
  const showToast = context?.showToast;

  const [tab, setTab] = useState("pets");
  const [pets, setPets] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "").split(",");
    if (!adminEmails.includes(currentUser.email)) {
      navigate("/");
      return;
    }
  }, [currentUser]);

  const getToken = () => currentUser.getIdToken();

  const fetchPets = async () => {
    const token = await getToken();
    const res = await api.get("/pets", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPets(Array.isArray(res.data) ? res.data : []);
  };

  const fetchDonations = async () => {
    const token = await getToken();
    const res = await api.get("/admin/donations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDonations(Array.isArray(res.data) ? res.data : []);
  };

  const fetchVolunteers = async () => {
    const token = await getToken();
    const res = await api.get("/volunteer", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setVolunteers(Array.isArray(res.data) ? res.data : []);
  };

  const updateVolunteerStatus = async (id, status) => {
    const token = await getToken();
    await api.patch(
      `/volunteer/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    showToast(`Application ${status}`);
    fetchVolunteers();
  };

  useEffect(() => {
    if (!currentUser) return;
    Promise.all([fetchPets(), fetchDonations(), fetchVolunteers()]).finally(
      () => setLoading(false),
    );
  }, [currentUser]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  const TABS = [
    { id: "pets", label: "🐾 Pets", badge: null },
    { id: "donations", label: "💰 Donations", badge: null },
    { id: "volunteers", label: `🙋 Volunteers`, badge: volunteers.length },
    { id: "blog", label: "✍️ Blog", badge: null },
  ];

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-dark text-white px-6 py-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <img
              src={LOGO}
              alt="HappyPaws"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <h1 className="font-serif text-xl font-bold">Admin Dashboard</h1>
          <p className="text-white/60 text-xs">{currentUser?.name}</p>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-white">
          <Link to="/admin" className="text-primary font-semibold">
            Admin
          </Link>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="px-4 py-2 rounded-full bg-primary text-white hover:bg-dark transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="tabs tabs-bordered mb-8">
          {TABS.map(({ id, label, badge }) => (
            <button
              key={id}
              className={`tab tab-lg font-semibold ${tab === id ? "tab-active text-primary" : "text-muted"}`}
              onClick={() => setTab(id)}
            >
              {label}
              {badge !== null && (
                <span className="ml-2 badge badge-sm bg-primary text-white border-none">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "pets" && (
          <PetsTab
            pets={pets}
            fetchPets={fetchPets}
            getToken={getToken}
            showToast={showToast}
          />
        )}

        {tab === "donations" && <DonationsTab donations={donations} />}

        {tab === "volunteers" && (
          <VolunteersTab
            volunteers={volunteers}
            updateVolunteerStatus={updateVolunteerStatus}
          />
        )}

        {tab === "blog" && (
          <BlogTab getToken={getToken} showToast={showToast} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
