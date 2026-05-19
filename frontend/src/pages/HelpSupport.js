import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RoleBadge from '../components/RoleBadge';
import socket from '../services/socket';

export default function HelpSupport() {
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    const handleTicketUpdate = () => {
      setLastRefresh(Date.now());
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
              <p className="text-muted mb-1">Support resources</p>
              <h2 className="mb-0">
                Help & Support
                <RoleBadge role={role} />
              </h2>
            </div>
          </div>

          <div className="bg-panel p-4 mb-4">
            <h5 className="mb-3">How we support you</h5>
            <p className="text-muted">Use these tools to get help fast, track your ticket, and share your experience with our support team.</p>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="card bg-dark border-0 h-100">
                  <div className="card-body">
                    <h6 className="card-title">Create a ticket</h6>
                    <p className="card-text text-muted">Report a problem, request help, or ask for service from our support desk.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/ticket/create')}>Create Ticket</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-dark border-0 h-100">
                  <div className="card-body">
                    <h6 className="card-title">Live chat</h6>
                    <p className="card-text text-muted">Join a live support room and chat directly with your agent in real time.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/chat')}>Open Chat</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-dark border-0 h-100">
                  <div className="card-body">
                    <h6 className="card-title">Submit feedback</h6>
                    <p className="card-text text-muted">Let us know how the support experience went and help us improve.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/feedback')}>Give Feedback</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-panel p-4 mb-4">
            <h5 className="mb-3">Need immediate assistance?</h5>
            <p className="text-muted">Our support desk is here for urgent issues, knowledge requests, and safety guidance.</p>
            <ul className="list-unstyled">
              <li className="mb-3">
                <strong>Email:</strong> <span className="text-white">support@snxdesk.com</span>
              </li>
              <li className="mb-3">
                <strong>Phone:</strong> <span className="text-white">+1 (800) 555-1234</span>
              </li>
              <li className="mb-3">
                <strong>Support hours:</strong> <span className="text-muted">Mon–Fri, 8am–6pm</span>
              </li>
            </ul>
          </div>

          <div className="bg-panel p-4">
            <h5 className="mb-3">Support checklist</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">• Describe the issue clearly and include the ticket category.</li>
              <li className="mb-2">• Attach any screenshots or error details in chat if available.</li>
              <li className="mb-2">• Use the feedback page after the issue is resolved to improve our service.</li>
              <li className="mb-2">• If you need escalation, mark your ticket priority as high.</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
