import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SubscriptionList from "./pages/SubscriptionList";
import AddSubscription from "./pages/AddSubscription";
export default function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex bg-slate-900 text-slate-100 min-h-screen">
      {!isLoginPage && <Navbar />}

      <main
        className={`flex-1 transition-all duration-300 ${!isLoginPage ? "md:ml-64 p-6 md:p-10 pb-24 md:pb-10" : ""}`}
      >
        <div className="max-w-6xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/subscriptions" element={<SubscriptionList />} />
            <Route path="/add" element={<AddSubscription />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
