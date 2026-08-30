// routes/AppRouter.jsx

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import Landing from "../pages/Landing";
import About from "../pages/About";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageDonors from "../pages/admin/ManageDonors";
import ManageHospitals from "../pages/admin/ManageHospitals";
import Inventory from "../pages/Inventory";

// Donor Pages
import DonorDashboard from "../pages/donor/DonorDashboard";
import DonorProfile from "../pages/donor/DonorProfile";
import DonationHistory from "../pages/donor/DonationHistory";
import PostBloodRequest from "../pages/donor/PostBloodRequest";
import MyRequests from "../pages/donor/MyRequests";

// Hospital Pages
import HospitalDashboard from "../pages/hospital/HospitalDashboard";
import HospitalProfile from "../pages/hospital/HospitalProfile";
import OpenRequests from "../pages/hospital/OpenRequests";
import MyAcceptedRequests from "../pages/hospital/MyAcceptedRequests";
import ManageInventory from "../pages/hospital/ManageInventory";
import RecordDonation from "../pages/hospital/RecordDonation";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/donors"    element={<ManageDonors />} />
        <Route path="/admin/hospitals" element={<ManageHospitals />} />
        <Route path="/admin/inventory" element={<Inventory />} />
      </Route>

      {/* Donor Routes */}
      <Route element={<ProtectedRoute allowedRoles={["donor"]} />}>
        <Route path="/donor/dashboard"     element={<DonorDashboard />} />
        <Route path="/donor/profile"       element={<DonorProfile />} />
        <Route path="/donor/donations"     element={<DonationHistory />} />
        <Route path="/donor/request-blood" element={<PostBloodRequest />} />
        <Route path="/donor/my-requests"   element={<MyRequests />} />
      </Route>

      {/* Hospital Routes */}
      <Route element={<ProtectedRoute allowedRoles={["hospital"]} />}>
        <Route path="/hospital/dashboard"         element={<HospitalDashboard />} />
        <Route path="/hospital/profile"           element={<HospitalProfile />} />
        <Route path="/hospital/open-requests"     element={<OpenRequests />} />
        <Route path="/hospital/accepted-requests" element={<MyAcceptedRequests />} />
        <Route path="/hospital/inventory"         element={<ManageInventory />} />
        <Route path="/hospital/record-donation"   element={<RecordDonation />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
