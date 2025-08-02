import React, { useState, useEffect } from "react";

const TelesalesDashboard = ({ currentUser }) => {
  const [stats, setStats] = useState({
    callsMade: 120,
    leadsContacted: 85,
    appointmentsSet: 15,
    callDuration: "4.5 mins",
  });
  const [callQueue, setCallQueue] = useState([
    { id: 1, name: "Lead A", priority: "High" },
    { id: 2, name: "Lead B", priority: "Medium" },
    { id: 3, name: "Lead C", priority: "Low" },
  ]);

  // TODO: Fetch real data from backend
  useEffect(() => {
    // fetchTelesalesStats();
    // fetchCallQueue();
  }, []);

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h2>Telesales Dashboard</h2>
          <p className="text-muted">Welcome, {currentUser.username}!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Calls Made Today
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.callsMade}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-phone fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Appointments Set
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.appointmentsSet}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar-check fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Avg. Call Duration
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.callDuration}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-clock fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Leads Contacted
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.leadsContacted}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-address-book fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Call Queue */}
        <div className="col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Call Queue</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Lead Name</th>
                      <th>Priority</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {callQueue.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.priority}</td>
                        <td>
                          <button className="btn btn-primary btn-sm">Call</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelesalesDashboard;
