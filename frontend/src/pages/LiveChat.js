import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import socket from '../services/socket';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import RoleBadge from '../components/RoleBadge';

export default function LiveChat() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const loadChatTickets = async () => {
    try {
      const response = await API.get('/tickets/chat-tickets');
      setTickets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadTicketHistory = async (ticket) => {
    if (!ticket) return;
    try {
      const response = await API.get(`/tickets/${ticket.id}/history`);
      const logMessages = response.data.map((entry) => ({
        text: entry.action,
        sender: entry.actor === localStorage.getItem('name') ? 'me' : 'other',
        senderLabel: entry.actor || 'System',
        timestamp: entry.timestamp || new Date().toISOString(),
        ticketId: entry.ticket_id
      }));
      setHistory(logMessages);
      setMessages(logMessages);
    } catch (error) {
      console.error(error);
    }
  };

  const selectTicket = (ticket) => {
    if (selectedTicket) {
      socket.emit('leave_room', { ticketId: selectedTicket.id });
    }
    setSelectedTicket(ticket);
    loadTicketHistory(ticket);
    socket.emit('join_room', { ticketId: ticket.id });
  };

  const handleReceive = (message) => {
    if (selectedTicket && message.ticketId === selectedTicket.id) {
      setMessages((prev) => [...prev, { ...message, sender: 'other', senderLabel: message.senderLabel || 'Support' }]);
    }
  };

  const sendMessage = async (text) => {
    if (!selectedTicket) return;
    const outgoing = {
      ticketId: selectedTicket.id,
      text,
      sender: 'me',
      senderLabel: localStorage.getItem('name') || 'Me',
      timestamp: new Date().toISOString()
    };

    socket.emit('send_message', outgoing);
    setMessages((prev) => [...prev, outgoing]);

    try {
      await API.post(`/tickets/${selectedTicket.id}/chat`, { content: text });
    } catch (error) {
      console.error('Unable to save chat message', error);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    loadChatTickets();
    socket.on('receive_message', handleReceive);
    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [selectedTicket]);

  return (
    <div className="container-fluid page-shell py-4">
      <div className="row gx-4">
        <aside className="col-12 col-xl-3 mb-4 sidebar-collapse">
          <Sidebar />
        </aside>

        <main className="col-12 col-xl-9">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <p className="text-muted mb-1">Live chat workspace</p>
              <h2 className="mb-0">
                Connect with your service team
                <RoleBadge role={role} />
              </h2>
            </div>
            <button className="btn btn-outline-light" onClick={logout}>Sign out</button>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="bg-panel p-4 h-100">
                <h5>Active tickets</h5>
                <p className="text-muted">Select a ticket to open the chat room.</p>
                <div className="list-group">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      className={`list-group-item list-group-item-action bg-transparent text-start ${selectedTicket?.id === ticket.id ? 'active' : ''}`}
                      onClick={() => selectTicket(ticket)}
                    >
                      <strong>{ticket.title}</strong>
                      <div className="small text-muted">#{ticket.id} • {ticket.category}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              {selectedTicket ? (
                <ChatBox
                  messages={messages}
                  sendMessage={sendMessage}
                  status={selectedTicket.status}
                />
              ) : (
                <div className="bg-panel p-4 h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center text-muted">
                    <h5>Select a ticket to start chatting</h5>
                    <p>Please choose a ticket from the left panel.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
