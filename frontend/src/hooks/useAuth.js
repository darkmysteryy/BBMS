// hooks/useAuth.js
// Simple hook to get the current user from Redux store

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isLoggedIn = !!token;
  const isAdmin    = user?.role === "admin";
  const isDonor    = user?.role === "donor";
  const isHospital = user?.role === "hospital";

  return { user, token, loading, error, isLoggedIn, isAdmin, isDonor, isHospital, handleLogout };
};

export default useAuth;
