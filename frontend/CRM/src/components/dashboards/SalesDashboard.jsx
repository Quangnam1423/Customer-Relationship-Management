import React, { useState, useEffect } from "react";

const SalesDashboard = ({ currentUser }) => {
  const [stats, setStats] = useState({
    newLeads: 25,
    opportunities: 15,
    closedWon: 5,
    salesTarget: "80%",
  });
  const [pipeline, setPipeline] = useState([
    { id: 1, name: "Tech Corp", stage: "Qualification", value: 50000 },
    { id: 2, name: "Innovate LLC", stage: "Proposal", value: 75000 },
    { id: 3, name: "Global Solutions", stage: "Negotiation", value: 120000 },
  ]);

  // TODO: Fetch real data from backend
  useEffect(() => {
    // fetchSalesStats();
    // fetchSalesPipeline();
  }, []);

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h2>Sales Dashboard</h2>
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
                    New Leads (This Month)
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.newLeads}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-user-plus fa-2x text-gray-300"></i>
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
                    Opportunities
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.opportunities}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-briefcase fa-2x text-gray-300"></i>
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
                    Closed-Won Deals
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.closedWon}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-handshake fa-2x text-gray-300"></i>
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
                    Sales Target Progress
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.salesTarget}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-chart-line fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Sales Pipeline */}
        <div className="col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Sales Pipeline</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Company Name</th>
                      <th>Stage</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pipeline.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.stage}</td>
                        <td>${item.value.toLocaleString()}</td>
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

export default SalesDashboard;
