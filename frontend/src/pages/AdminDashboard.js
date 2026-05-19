import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import StatisticsCard from '../components/StatisticsCard';
import StatusBadge from '../components/StatusBadge';
import RoleBadge from '../components/RoleBadge';
import socket from '../services/socket';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({ ticketCounts: {}, ratingsSummary: {}, categories: [] });
  const [filter, setFilter] = useState({ status: '', category_id: '', keyword: '' });
  const [newCategory, setNewCategory] = useState('');
  const role = localStorage.getItem('role');

  const loadData = async () => {
    try {
      const [ticketRes, userRes, categoryRes, summaryRes] = await Promise.all([
        API.get('/admin/tickets', { params: filter }),
        API.get('/admin/users'),
        API.get('/admin/categories'),
        API.get('/reports/summary')
      ]);

      setTickets(ticketRes.data);
      setUsers(userRes.data);
      setCategories(categoryRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitCategory = async (event) => {
    event.preventDefault();
    if (!newCategory) return;
    await API.post('/categories', { category_name: newCategory });
    setNewCategory('');
    loadData();
  };

  const assignToStaff = async (ticketId, staffId) => {
    if (!staffId) return;

    try {
      await API.post(`/admin/tickets/${ticketId}/assign`, { staffId });
      await loadData();
    } catch (error) {
      console.error(error);
      alert('Unable to assign ticket.');
    }
  };

  const updateStatus = async (ticketId, status) => {
    if (!status) return;

    try {
      await API.patch(`/admin/tickets/${ticketId}/status`, { status });
      await loadData();
    } catch (error) {
      console.error(error);
      alert('Unable to update ticket status.');
    }
  };

  useEffect(() => {
    loadData();
  }, [filter.status, filter.category_id, filter.keyword]);

  useEffect(() => {
    const handleFocus = () => {
      loadData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [filter.status, filter.category_id, filter.keyword]);

  useEffect(() => {
    const ticketUpdateHandler = () => {
      loadData();
    };

    socket.on('ticket_updated', ticketUpdateHandler);
    return () => {
      socket.off('ticket_updated', ticketUpdateHandler);
    };
  }, [filter.status, filter.category_id, filter.keyword]);

  const openCount = Number(summary.ticketCounts?.open_count || 0);
  const assignedCount = Number(summary.ticketCounts?.assigned_count || 0);
  const inProgressCount = Number(summary.ticketCounts?.in_progress_count || 0);
  const resolvedCount = Number(summary.ticketCounts?.resolved_count || 0);
  const closedCount = Number(summary.ticketCounts?.closed_count || 0);
  const totalCount = Number(summary.ticketCounts?.total_count || 0);
  const pendingCount = openCount + assignedCount + inProgressCount;

  const chartData = {
    labels: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
    datasets: [
      {
        label: 'Ticket Status',
        backgroundColor: ['#38bdf8', '#7c3aed', '#f59e0b', '#22c55e', '#64748b'],
        data: [openCount, assignedCount, inProgressCount, resolvedCount, closedCount]
      }
    ]
  };

  return (
    <div className="container-fluid page-shell py-4">
      <div className="row gx-4">
        <aside className="col-12 col-xl-3 mb-4 sidebar-collapse">
          <Sidebar />
        </aside>
        <main className="col-12 col-xl-9">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <p className="text-muted mb-1">Admin console</p>
              <h2 className="mb-0">
                Enterprise support command center
                <RoleBadge role={role} />
              </h2>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <StatisticsCard title="Total Tickets" value={totalCount} icon="🎫" accent="text-info" />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatisticsCard title="Resolved" value={resolvedCount} icon="✅" accent="text-success" />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatisticsCard title="Pending" value={pendingCount} icon="⏳" accent="text-warning" />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatisticsCard title="Feedbacks" value={summary.ratingsSummary?.total_feedback || 0} icon="⭐" accent="text-secondary" />
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="bg-panel p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5>Ticket Insights</h5>
                    <p className="text-muted mb-0">Filter and assign tickets across the service desk.</p>
                  </div>
                </div>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <select className="form-select bg-dark text-white border-0" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                      <option value="">All statuses</option>
                      <option value="Open">Open</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select bg-dark text-white border-0" value={filter.category_id} onChange={(e) => setFilter({ ...filter, category_id: e.target.value })}>
                      <option value="">All categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input
                      className="form-control bg-dark text-white border-0"
                      value={filter.keyword}
                      placeholder="Search tickets"
                      onChange={(e) => setFilter({ ...filter, keyword: e.target.value })}
                    />
                  </div>
                </div>
                <div className="chart-container">
                  <Bar data={chartData} options={{ plugins: { legend: { display: false } } }} />
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-panel p-4 h-100">
                <h5 className="mb-3">Team performance</h5>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Excellent rating</span>
                    <strong>{summary.ratingsSummary?.excellent || 0}</strong>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div className="progress-bar bg-success" style={{ width: `${Math.min((summary.ratingsSummary?.excellent || 0) / Math.max(summary.ratingsSummary?.total_feedback || 1, 1) * 100, 100)}%` }} />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Needs improvement</span>
                    <strong>{summary.ratingsSummary?.improvement_needed || 0}</strong>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div className="progress-bar bg-warning" style={{ width: `${Math.min((summary.ratingsSummary?.improvement_needed || 0) / Math.max(summary.ratingsSummary?.total_feedback || 1, 1) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-panel p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5>Ticket queue</h5>
                <p className="text-muted mb-0">Assign, update status, and monitor team workload.</p>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-borderless text-white align-middle">
                <thead>
                  <tr className="text-muted small">
                    <th>Ticket</th>
                    <th>Category</th>
                    <th>Owner</th>
                    <th>Assignee</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-top border-secondary">
                      <td>
                        <strong>{ticket.title}</strong>
                        <div className="small text-muted">#{ticket.id}</div>
                      </td>
                      <td>{ticket.category || 'General'}</td>
                      <td>{ticket.requester}</td>
                      <td>{ticket.assigned_staff || 'Unassigned'}</td>
                      <td><StatusBadge status={ticket.status} /></td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <select className="form-select form-select-sm bg-dark text-white border-0" onChange={(e) => assignToStaff(ticket.id, e.target.value)}>
                            <option value="">Assign</option>
                            {users.filter((user) => user.role === 'support').map((staff) => (
                              <option key={staff.id} value={staff.id}>{staff.name}</option>
                            ))}
                          </select>
                          <select className="form-select form-select-sm bg-dark text-white border-0" onChange={(e) => updateStatus(ticket.id, e.target.value)}>
                            <option value="">Set status</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-panel p-4">
            <h5>Categories</h5>
            <form className="row g-2 align-items-center" onSubmit={submitCategory}>
              <div className="col-auto flex-grow-1">
                <input
                  className="form-control bg-dark text-white border-0"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-primary">Create</button>
              </div>
            </form>
            <div className="mt-3">
              {categories.map((category) => (
                <span key={category.id} className="badge bg-secondary me-2 mb-2">{category.category_name}</span>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
