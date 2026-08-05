// layouts/AuthLayout.jsx
// Centered layout used for Login and Signup pages

import Navbar from "../components/common/Navbar";

const AuthLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ paddingTop: "64px" }}>
      <div className="auth-layout">{children}</div>
    </main>
  </>
);

export default AuthLayout;
