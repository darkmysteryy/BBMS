// routes/AppRouter.jsx

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import Landing from "../pages/Landing";
import About from "../pages/About";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Inventory from "../pages/Inventory";
import NotFound from "../pages/NotFound";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageDonors from "../pages/admin/ManageDonors";
import ManageHospitals from "../pages/admin/ManageHospitals";
import ManageRequests from "../pages/admin/ManageRequests";
import Reports from "../pages/admin/Reports";

// Donor Pages
import DonorDashboard from "../pages/donor/DonorDashboard";
import DonorProfile from "../pages/donor/DonorProfile";
import DonationHistory from "../pages/donor/DonationHistory";

// Hospital Pages
import HospitalDashboard from "../pages/hospital/HospitalDashboard";
import HospitalProfile from "../pages/hospital/HospitalProfile";
import RequestBlood from "../pages/hospital/RequestBlood";
import RequestHistory from "../pages/hospital/RequestHistory";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Shared Protected Route */}
      <Route element={<ProtectedRoute />}>
        <Route path="/inventory" element={<Inventory />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/donors" element={<ManageDonors />} />
        <Route path="/admin/hospitals" element={<ManageHospitals />} />
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/admin/requests" element={<ManageRequests />} />
        <Route path="/admin/reports" element={<Reports />} />
      </Route>

      {/* Donor Routes */}
      <Route element={<ProtectedRoute allowedRoles={["donor"]} />}>
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/donor/profile" element={<DonorProfile />} />
        <Route path="/donor/donations" element={<DonationHistory />} />
      </Route>

      {/* Hospital Routes */}
      <Route element={<ProtectedRoute allowedRoles={["hospital"]} />}>
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/profile" element={<HospitalProfile />} />
        <Route path="/hospital/request" element={<RequestBlood />} />
        <Route path="/hospital/requests" element={<RequestHistory />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
