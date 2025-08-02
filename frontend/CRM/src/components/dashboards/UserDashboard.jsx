import React from "react";

const UserDashboard = ({ currentUser }) => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="card-title">Welcome, {currentUser.username}!</h2>
              <p className="card-text">
                This is your personal dashboard. More features coming soon!
              </p>
              <hr />
              <h5>Your Profile</h5>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p>
                <strong>Role:</strong>{" "}
                {currentUser.roles && currentUser.roles.length > 0
                  ? currentUser.roles.join(", ")
                  : "User"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
