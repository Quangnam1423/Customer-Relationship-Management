import React, { useState, useEffect } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import AuthService from "../services/auth.service";
import AdminDashboard from "./admin/AdminDashboard";
import MarketingDashboard from "./dashboards/MarketingDashboard";
import SalesDashboard from "./dashboards/SalesDashboard";
import TelesalesDashboard from "./dashboards/TelesalesDashboard";
import UserDashboard from "./dashboards/UserDashboard";


const Dashboard = () => {
  useDocumentTitle('Dashboard');
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const renderDashboardByRole = () => {
    // First, handle the loading state
    if (currentUser === undefined) {
      return <div>Loading...</div>;
    }

    // After loading, if there's no user, show a default user dashboard or redirect
    if (!currentUser) {
      // Passing a mock guest user to prevent crash in the child component
      return <UserDashboard currentUser={{ username: "Guest", roles: ["Guest"] }} />;
    }

    // Debug logging to see what we're getting
    console.log("Current User:", currentUser);
    console.log("Roles:", currentUser.roles);
    console.log("Permission Level:", currentUser.permissionLevel);

    const level = currentUser.permissionLevel;
    const roles = currentUser.roles || [];

    // Check both permissionLevel and roles for more robust detection
    // Priority: Admin > Marketing > Sales > Telesales > User
    if (level >= 8 || roles.includes("ROLE_ADMIN")) {
      console.log("Rendering Admin Dashboard");
      return <AdminDashboard />;
    }
    if (level >= 4 || roles.includes("ROLE_MARKETING")) {
      console.log("Rendering Marketing Dashboard");
      return <MarketingDashboard />;
    }
    if (level >= 2 || roles.includes("ROLE_SALES")) {
      console.log("Rendering Sales Dashboard");
      return <SalesDashboard />;
    }
    if (level >= 1 || roles.includes("ROLE_TELESALES")) {
      console.log("Rendering Telesales Dashboard");
      return <TelesalesDashboard />;
    }
    
    // Default for permissionLevel 0 or if level is not defined
    console.log("Rendering User Dashboard");
    return <UserDashboard />;
  };

  return (
    <>
      {renderDashboardByRole()}
    </>
  );
};

export default Dashboard;
