// src/App.jsx
import { useEffect, useState } from "react";
import SplashScreen from "./Components/SplashScreen";
//import Home from "./Components/Home.jsx";
//import Complaints from "./Components/Complaints.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./PrimaryAdmin/AdminLogin";
import AdminDashboard from "./PrimaryAdmin/AdminDashboard";
import Error404 from "./PrimaryAdmin/Error404";
import PrivateRoute from "./PrimaryAdmin/PrivateRoute";
import AdminDepartments from "./PrimaryAdmin/AdminDepartments";
import AdminServiceTypes from "./PrimaryAdmin/AdminServiceTypes";
import AdminSkills from "./PrimaryAdmin/AdminSkills";
import AdminPriorities from "./PrimaryAdmin/AdminPriorities";
import AdminComplaintCategories from "./PrimaryAdmin/AdminComplaintCategories";
import AdminComplaintGallery from "./PrimaryAdmin/AdminComplaintGallery";
import JobPortalDashboard from "./JobPortal/JobPortalDashboard";
import ComplaintBook from "./JobPortal/ComplaintBook";
import Dropdown from "./JobPortal/Dropdown";
import JobApplicationForm from "./JobPortal/JobApplicationForm";
import JobApplicationSuccess from "./JobPortal/JobApplicationSuccess";
import SecondaryAdminApproval from "./PrimaryAdmin/SecondaryAdminApproval";

//import CitizenSignup from "./Components/Signup/CitizenSignup.jsx";
//import AboutUs from "./Components/About/AboutUs.jsx";
//import ContactUs from "./Components/ContactUs/ContactUs.jsx";
//import CitizenLogin from "./Components/Login/CitizenLogin.jsx";
//import RolePortal from "./Components/RolePortal/RolePortal.jsx";
//import AdminDashboard from "./Components/AdminDashboard.jsx";
//import CitizenDashboard from "./Admin/CitizenDashboard/CitizenDashboard.jsx";
//import ComplaintForm from "./Admin/ComplaintForm/ComplaintForm.jsx";
//import CategoryPage from "./Admin/CategoryPage/CategoryPage.jsx";
//import ViewStatus from "./Admin/ViewStatus/ViewStatus.jsx";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <BrowserRouter>
      <div className="page-root">
        {showSplash ? (
          <SplashScreen />
        ) : (
          <Routes>
            {/*}
            <Route path="/" element={<Home />} />
            <Route path="/start_complaints" element={<Complaints />} />

            <Route path="/citizen_signup" element={<CitizenSignup />} />
            <Route path="/citizen_login" element={<CitizenLogin />} />
            <Route path="/about_us" element={<AboutUs />} />
            <Route path="/contact_us" element={<ContactUs />} />

            <Route path="/start" element={<RolePortal />} />
            <Route path="/abc" element={<AdminDashboard />} />

            <Route path="/citizen_dashboard/" element={<CitizenDashboard />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/complaint/new" element={<ComplaintForm />} />
            <Route path="/complaints/status" element={<ViewStatus />} />

            {/* Primary Admin side */}
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route
              path="/admindashboard"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admindepartments"
              element={
                <PrivateRoute>
                  <AdminDepartments />
                </PrivateRoute>
              }
            />
            <Route
              path="/adminservice-types"
              element={
                <PrivateRoute>
                  <AdminServiceTypes />
                </PrivateRoute>
              }
            />
            <Route
              path="/adminskills"
              element={
                <PrivateRoute>
                  <AdminSkills />
                </PrivateRoute>
              }
            />
            <Route
              path="/adminpriorities"
              element={
                <PrivateRoute>
                  <AdminPriorities />
                </PrivateRoute>
              }
            />
            <Route
              path="/admincomplaint-categories"
              element={
                <PrivateRoute>
                  <AdminComplaintCategories />
                </PrivateRoute>
              }
            />
            <Route
              path="/admincategory-gallery"
              element={
                <PrivateRoute>
                  <AdminComplaintGallery />
                </PrivateRoute>
              }
            />

            <Route
              path="/jobportal-dashboard"
              element={
                <PrivateRoute>
                  <JobPortalDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/jobportal-book"
              element={
                <PrivateRoute>
                  <ComplaintBook />
                </PrivateRoute>
              }
            />

            <Route
              path="/jobportal-applicationform"
              element={
                <PrivateRoute>
                  <JobApplicationForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/job-application-success"
              element={
                <PrivateRoute>
                  <JobApplicationSuccess />
                </PrivateRoute>
              }
            />

            <Route
              path="/secondary-admin-approvals"
              element={
                <PrivateRoute>
                  <SecondaryAdminApproval />
                </PrivateRoute>
              }
            />

            <Route
              path="dropdown"
              element={
                <PrivateRoute>
                  <Dropdown />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Error404 />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}
