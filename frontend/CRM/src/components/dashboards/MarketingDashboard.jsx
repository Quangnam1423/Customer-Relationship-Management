import React, { useState, useEffect } from "react";

const MarketingDashboard = ({ currentUser }) => {
  const [stats, setStats] = useState({
    totalCampaigns: 12,
    activeCampaigns: 3,
    leadsGenerated: 450,
    conversionRate: "15%",
  });
  const [recentLeads, setRecentLeads] = useState([
    { id: 1, name: "John Doe", source: "Website Form", date: "2 hours ago" },
    { id: 2, name: "Jane Smith", source: "Facebook Ad", date: "5 hours ago" },
    { id: 3, name: "Peter Jones", source: "Email Campaign", date: "1 day ago" },
  ]);

  // TODO: Fetch real data from backend
  useEffect(() => {
    // fetchMarketingStats();
    // fetchRecentLeads();
  }, []);

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h2>Marketing Dashboard</h2>
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
                    Total Campaigns
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalCampaigns}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-bullhorn fa-2x text-gray-300"></i>
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
                    Leads Generated (This Month)
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.leadsGenerated}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-300"></i>
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
                    Lead Conversion Rate
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.conversionRate}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-percentage fa-2x text-gray-300"></i>
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
                    Active Campaigns
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.activeCampaigns}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-play-circle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Campaign Performance */}
        <div className="col-lg-8">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Campaign Performance</h6>
            </div>
            <div className="card-body">
              {/* Placeholder for a chart */}
              <div className="text-center">
                <p>Campaign performance chart will be here.</p>
                <i className="fas fa-chart-bar fa-5x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="col-lg-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Recent Leads</h6>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {recentLeads.map(lead => (
                  <li key={lead.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{lead.name}</strong>
                      <br />
                      <small className="text-muted">{lead.source}</small>
                    </div>
                    <small>{lead.date}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingDashboard;
