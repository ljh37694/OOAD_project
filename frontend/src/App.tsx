import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SubscriptionList from "./pages/SubscriptionList";
import AddSubscription from "./pages/AddSubscription";
import EditSubscription from "./pages/EditSubscription";
import Profile from "./pages/Profile";
import CalendarView from "./pages/CalendarView";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";

  const isDashboard = location.pathname === "/";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt_token", token);
      // Remove token from URL for cleaner UI
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className={`flex bg-slate-900 text-slate-100 ${isDashboard ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      {!isLoginPage && <Navbar />}

      <main
        className={`flex-1 transition-all duration-300 ${!isLoginPage ? "md:ml-64 p-6 md:p-10 pb-24 md:pb-10" : ""} ${isDashboard ? "h-screen flex flex-col overflow-hidden" : ""}`}
      >
        <div className={`max-w-6xl mx-auto w-full ${isDashboard ? "h-full flex flex-col overflow-hidden" : ""}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/subscriptions" element={<SubscriptionList />} />
            <Route path="/add" element={<AddSubscription />} />
            <Route path="/edit/:id" element={<EditSubscription />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/calendar" element={<CalendarView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
