import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import RoleBadge from '../components/RoleBadge';
import socket from '../services/socket';

export default function StaffDashboard() {
  const [tickets, setTickets] = useState([]);
  const [statusByTicket, setStatusByTicket] = useState({});
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const loadAssigned = async () => {
    try {
      const response = await API.get('/tickets/assigned');
      setTickets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (ticketId, status) => {
    try {
      await API.patch(`/admin/tickets/${ticketId}/status`, { status });
      loadAssigned();
    } catch (error) {
      alert('Unable to update status');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    loadAssigned();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadAssigned();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const handleTicketUpdate = () => {
      loadAssigned();
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
              <p className="text-muted mb-1">Support staff board</p>
              <h2 className="mb-0">
                Resolve assigned issues quickly
                <RoleBadge role={role} />
              </h2>
            </div>
            <button className="btn btn-outline-light" onClick={logout}>Log out</button>
          </div>

          <div className="bg-panel p-4 mb-4">
            <h5 className="mb-3">My assigned tickets</h5>
            <div className="table-responsive">
              <table className="table table-borderless text-white align-middle">
                <thead>
                  <tr className="text-muted small">
                    <th>Ticket</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-top border-secondary">
                      <td>
                        <strong>{ticket.title}</strong>
                        <div className="small text-muted">#{ticket.id} • {ticket.requester}</div>
                      </td>
                      <td>{ticket.category || 'General'}</td>
                      <td>{ticket.priority}</td>
                      <td><StatusBadge status={ticket.status} /></td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          {['In Progress', 'Resolved', 'Closed'].map((status) => (
                            <button
                              key={status}
                              className="btn btn-sm btn-outline-light"
                              onClick={() => updateStatus(ticket.id, status)}
                            >
                              {status}
                            </button>
                          ))}
                          <button className="btn btn-sm btn-primary" onClick={() => navigate('/chat')}>
                            Chat
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
