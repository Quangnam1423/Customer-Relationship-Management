import React from "react";
import LeadManagement from "../LeadManagement";

const UserDashboard = () => {
  // We get currentUser from AuthService, so no need to pass it as a prop here
  return <LeadManagement />;
};

export default UserDashboard;
