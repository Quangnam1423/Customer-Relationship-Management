import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Statistics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  
  // Filter state
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    assignedUserId: null,
    myLeadsOnly: false
  });

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const response = await axios.get('http://localhost:8080/api/users/assignable', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      const filterRequest = {
        startDate: filters.startDate ? filters.startDate.toISOString() : null,
        endDate: filters.endDate ? filters.endDate.toISOString() : null,
        assignedUserId: filters.myLeadsOnly ? currentUser?.id : filters.assignedUserId
      };

      console.log('Fetching statistics with filters:', filterRequest);
      console.log('Current user:', currentUser);

      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log('Token:', token ? 'Present' : 'Missing');

      const response = await axios.post('http://localhost:8080/api/statistics/leads', filterRequest, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Statistics response:', response.data);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    fetchStatistics();
  };

  const clearFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      assignedUserId: null,
      myLeadsOnly: false
    });
    // Auto apply after clearing
    setTimeout(() => {
      fetchStatistics();
    }, 100);
  };

  // Chart colors
  const statusColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
  ];

  const sourceColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
  ];

  const assignedUserColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
  ];

  const createChartData = (data, colors) => {
    const labels = Object.keys(data);
    const values = Object.values(data);

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color + 'CC'),
          borderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  if (loading) {
    return (
      <div className="statistics-container">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      {/* Header */}
      <div className="statistics-header">
        <h2>
          <i className="fas fa-chart-pie me-2"></i>
          Thống kê Lead
        </h2>
        <p className="text-muted">Tổng quan về tình hình lead trong hệ thống</p>
      </div>

      {/* Filter Section */}
      <div className="filter-card mb-4">
        <div className="card-header">
          <h6 className="mb-0">
            <i className="fas fa-filter me-2"></i>
            Bộ lọc thống kê
          </h6>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Từ ngày</label>
              <DatePicker
                selected={filters.startDate}
                onChange={(date) => handleFilterChange('startDate', date)}
                className="form-control"
                placeholderText="Chọn ngày bắt đầu"
                dateFormat="dd/MM/yyyy"
                isClearable
                maxDate={new Date()}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Đến ngày</label>
              <DatePicker
                selected={filters.endDate}
                onChange={(date) => handleFilterChange('endDate', date)}
                className="form-control"
                placeholderText="Chọn ngày kết thúc"
                dateFormat="dd/MM/yyyy"
                isClearable
                minDate={filters.startDate}
                maxDate={new Date()}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Người phụ trách</label>
              <select
                className="form-select"
                value={filters.assignedUserId || ''}
                onChange={(e) => handleFilterChange('assignedUserId', e.target.value || null)}
                disabled={filters.myLeadsOnly}
              >
                <option value="">Tất cả</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.fullName || user.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <div className="form-check me-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="myLeadsOnly"
                  checked={filters.myLeadsOnly}
                  onChange={(e) => handleFilterChange('myLeadsOnly', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="myLeadsOnly">
                  Chỉ lead của tôi
                </label>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <button className="btn btn-primary me-2" onClick={applyFilters}>
                <i className="fas fa-chart-bar me-1"></i>
                Áp dụng
              </button>
              <button className="btn btn-outline-secondary" onClick={clearFilters}>
                <i className="fas fa-eraser me-1"></i>
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="summary-card">
            <h4 className="text-center">
              <i className="fas fa-users me-2 text-primary"></i>
              Tổng số Lead: <span className="text-primary">{statistics?.totalLeads || 0}</span>
            </h4>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        {/* Status Chart */}
        <div className="col-12 mb-4">
          <div className="chart-card">
            <div className="card-header">
              <h6>
                <i className="fas fa-tasks me-2"></i>
                Thống kê theo trạng thái
              </h6>
            </div>
            <div className="card-body">
              <div className="chart-container">
                {statistics?.statusStatistics && Object.keys(statistics.statusStatistics).length > 0 ? (
                  <Pie 
                    data={createChartData(statistics.statusStatistics, statusColors)} 
                    options={chartOptions}
                  />
                ) : (
                  <div className="text-center text-muted p-4">
                    <i className="fas fa-chart-pie fa-3x mb-3"></i>
                    <p>Không có dữ liệu</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        {/* Source Chart */}
        <div className="col-12 mb-4">
          <div className="chart-card">
            <div className="card-header">
              <h6>
                <i className="fas fa-share-alt me-2"></i>
                Thống kê theo nguồn
              </h6>
            </div>
            <div className="card-body">
              <div className="chart-container">
                {statistics?.sourceStatistics && Object.keys(statistics.sourceStatistics).length > 0 ? (
                  <Pie 
                    data={createChartData(statistics.sourceStatistics, sourceColors)} 
                    options={chartOptions}
                  />
                ) : (
                  <div className="text-center text-muted p-4">
                    <i className="fas fa-chart-pie fa-3x mb-3"></i>
                    <p>Không có dữ liệu</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Assigned User Chart */}
        <div className="col-12 mb-4">
          <div className="chart-card">
            <div className="card-header">
              <h6>
                <i className="fas fa-user-tie me-2"></i>
                Thống kê theo người phụ trách
              </h6>
            </div>
            <div className="card-body">
              <div className="chart-container">
                {statistics?.assignedUserStatistics && Object.keys(statistics.assignedUserStatistics).length > 0 ? (
                  <Pie 
                    data={createChartData(statistics.assignedUserStatistics, assignedUserColors)} 
                    options={chartOptions}
                  />
                ) : (
                  <div className="text-center text-muted p-4">
                    <i className="fas fa-chart-pie fa-3x mb-3"></i>
                    <p>Không có dữ liệu</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
