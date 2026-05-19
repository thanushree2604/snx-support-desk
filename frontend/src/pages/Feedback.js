import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import StatisticsCard from '../components/StatisticsCard';
import StatusBadge from '../components/StatusBadge';
import RoleBadge from '../components/RoleBadge';
import socket from '../services/socket';

export default function Feedback() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState('');
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const stats = {
    total: tickets.length,
    open: tickets.filter((ticket) => ticket.status === 'Open').length,
    resolved: tickets.filter((ticket) => ticket.status === 'Resolved' || ticket.status === 'Closed').length,
    pending: tickets.filter((ticket) => ticket.status === 'Assigned' || ticket.status === 'In Progress').length
  };

  const fetchTickets = async () => {
    try {
      const response = await API.get('/tickets/mine');
      setTickets(response.data);
      if (!selectedTicket && response.data.length > 0) {
        setSelectedTicket(response.data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitFeedback = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!selectedTicket) {
      setError('Please choose a ticket to review.');
      return;
    }

    if (!rating) {
      setError('Select a rating before submitting feedback.');
      return;
    }

    try {
      await API.post(`/feedback/${selectedTicket}`, {
        rating: Number(rating),
        comments
      });
      setMessage('Thank you! Your feedback has been submitted.');
      setRating('');
      setComments('');
      fetchTickets();
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to submit feedback.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const handleFocus = () => fetchTickets();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const handleTicketUpdate = () => {
      fetchTickets();
    };

    socket.on('ticket_updated', handleTicketUpdate);
    return () => {
      socket.off('ticket_updated', handleTicketUpdate);
    };
  }, []);

  return (
    <div className="container-fluid page-shell py-4">
      <div className="row gx-4">
        <aside className="col-12 col-xl-3 mb-4 sidebar-collapse">
          <Sidebar />
        </aside>

        <main className="col-12 col-xl-9">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <p className="text-muted mb-1">Share your experience</p>
              <h2 className="mb-0">
                Feedback Center
                <RoleBadge role={role} />
              </h2>
            </div>
            <button className="btn btn-outline-light" onClick={() => navigate('/dashboard')}>Back to dashboard</button>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <StatisticsCard title="My Tickets" value={stats.total} icon="🎫" accent="text-info" />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatisticsCard title="Open" value={stats.open} icon="📩" accent="text-primary" />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatisticsCard title="Pending" value={stats.pending} icon="⏳" accent="text-warning" />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatisticsCard title="Resolved" value={stats.resolved} icon="✅" accent="text-success" />
            </div>
          </div>

          <div className="bg-panel p-4 mb-4">
            <h5 className="mb-3">Submit feedback for a ticket</h5>
            <p className="text-muted mb-4">Choose the ticket you want to review, add stars, and tell us how the support experience felt.</p>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={submitFeedback} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Select ticket</label>
                <select
                  className="form-select bg-dark text-white border-0"
                  value={selectedTicket}
                  onChange={(e) => setSelectedTicket(e.target.value)}
                >
                  {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <option key={ticket.id} value={ticket.id}>
                        #{ticket.id} • {ticket.title} ({ticket.status})
                      </option>
                    ))
                  ) : (
                    <option value="">No tickets available</option>
                  )}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Rating</label>
                <select
                  className="form-select bg-dark text-white border-0"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Choose rating</option>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Great</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Needs improvement</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Comments</label>
                <textarea
                  className="form-control bg-dark text-white border-0"
                  rows="4"
                  value={comments}
                  placeholder="Tell us what worked well or what we can improve."
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              <div className="col-12 d-flex gap-2 flex-wrap">
                <button className="btn btn-primary" type="submit">Submit feedback</button>
                <button className="btn btn-outline-light" type="button" onClick={() => navigate('/ticket/create')}>Create support ticket</button>
                <button className="btn btn-outline-light" type="button" onClick={() => navigate('/chat')}>Open live chat</button>
              </div>
            </form>
          </div>

          <div className="bg-panel p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5>My ticket history</h5>
                <p className="text-muted mb-0">Review recent tickets and submit feedback once the support work is complete.</p>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-borderless text-white align-middle">
                <thead>
                  <tr className="text-muted small">
                    <th>Ticket</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-top border-secondary">
                        <td>
                          <strong>{ticket.title}</strong>
                          <div className="small text-muted">#{ticket.id}</div>
                        </td>
                        <td>{ticket.category || 'General'}</td>
                        <td><StatusBadge status={ticket.status} /></td>
                        <td>{new Date(ticket.updated_at || ticket.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No tickets found. Create a new request to share feedback after support is delivered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
