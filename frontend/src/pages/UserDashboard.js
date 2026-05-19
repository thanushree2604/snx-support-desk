import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import socket from '../services/socket';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import StatisticsCard from '../components/StatisticsCard';
import RoleBadge from '../components/RoleBadge';

export default function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  const stats = {
    open: tickets.filter((ticket) => ticket.status === 'Open').length,
    assigned: tickets.filter((ticket) => ticket.status === 'Assigned' || ticket.assigned_staff).length,
    inProgress: tickets.filter((ticket) => ticket.status === 'In Progress').length,
    resolved: tickets.filter((ticket) => ticket.status === 'Resolved').length,
    closed: tickets.filter((ticket) => ticket.status === 'Closed').length,
  };

  const fetchTickets = async () => {
    try {
      const response = await API.get('/tickets/mine');
      setTickets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const joinTicketRooms = (ticketIds) => {
    const newRooms = ticketIds.filter((ticketId) => !joinedRooms.includes(ticketId));
    const staleRooms = joinedRooms.filter((ticketId) => !ticketIds.includes(ticketId));

    newRooms.forEach((ticketId) => {
      socket.emit('join_room', { ticketId });
    });
    staleRooms.forEach((ticketId) => {
      socket.emit('leave_room', { ticketId });
    });

    setJoinedRooms(ticketIds);
  };

  const refreshTickets = async () => {
    await fetchTickets();
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    refreshTickets();
  }, [location.key, location.state?.refresh]);

  useEffect(() => {
    window.addEventListener('focus', refreshTickets);
    return () => window.removeEventListener('focus', refreshTickets);
  }, []);

  useEffect(() => {
    const handleTicketUpdate = () => {
      refreshTickets();
    };

    socket.on('ticket_updated', handleTicketUpdate);
    return () => {
      socket.off('ticket_updated', handleTicketUpdate);
    };
  }, []);

  useEffect(() => {
    if (tickets.length === 0) return;

    const ticketIds = tickets.map((ticket) => ticket.id);
    joinTicketRooms(ticketIds);

    const handleReceive = (message) => {
      if (ticketIds.includes(message.ticketId)) {
        refreshTickets();
      }
    };

    socket.on('receive_message', handleReceive);
    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [tickets]);

  return (
    <div className="container-fluid page-shell py-4">
      <div className="row gx-4">
        <aside className="col-12 col-xl-3 mb-4 sidebar-collapse">
          <Sidebar />
        </aside>

        <main className="col-12 col-xl-9">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <p className="text-muted mb-1">Welcome back,</p>
              <h2 className="mb-0">
                {name || 'User'}
                <RoleBadge role={role} />
              </h2>
            </div>
            <button className="btn btn-outline-light" onClick={logout}>Log out</button>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <StatisticsCard title="Open Tickets" value={stats.open} icon="📩" accent="text-info" />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatisticsCard title="Assigned" value={stats.assigned} icon="🧑‍💻" accent="text-warning" />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatisticsCard title="In Progress" value={stats.inProgress} icon="⏳" accent="text-primary" />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatisticsCard title="Resolved" value={stats.resolved} icon="✅" accent="text-success" />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatisticsCard title="Closed" value={stats.closed} icon="🔒" accent="text-secondary" />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="bg-panel p-4 h-100 d-flex flex-column">
                <h5>Need Help?</h5>
                <p className="text-muted">Submit a new support ticket and access help resources or feedback tools.</p>
                <div className="d-flex flex-column gap-2 mt-auto">
                  <button className="btn btn-primary btn-lg" onClick={() => navigate('/ticket/create')}>
                    + Create New Ticket
                  </button>
                  <button className="btn btn-outline-light btn-lg" onClick={() => navigate('/help')}>
                    Go to Help & Support
                  </button>
                  <button className="btn btn-outline-light btn-lg" onClick={() => navigate('/feedback')}>
                    Leave Feedback
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="bg-panel p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5>Your Tickets</h5>
                    <p className="text-muted mb-0">Track status, category, and support updates.</p>
                  </div>
                  <button className="btn btn-outline-light" onClick={() => navigate('/chat')}>Open Live Chat</button>
                </div>

                <div className="table-responsive">
                  <table className="table table-borderless text-white align-middle">
                    <thead>
                      <tr className="text-muted small">
                        <th scope="col">Ticket</th>
                        <th scope="col">Category</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.length > 0 ? (
                        tickets.map((ticket) => (
                          <tr key={ticket.id} className="border-top border-secondary">
                            <td>
                              <strong>{ticket.title}</strong>
                              <div className="small text-muted">#{ticket.id} opened on {new Date(ticket.created_at).toLocaleDateString()}</div>
                            </td>
                            <td>{ticket.category || 'General'}</td>
                            <td>{ticket.priority}</td>
                            <td><StatusBadge status={ticket.status} /></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-4">
                            No tickets yet. Create one to get started!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
