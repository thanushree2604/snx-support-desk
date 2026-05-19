import { useState } from 'react';
import StatusBadge from './StatusBadge';

export default function ChatBox({ messages, sendMessage, status }) {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    sendMessage(value.trim());
    setValue('');
  };

  return (
    <div className="glass-card p-4 h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 className="mb-1">Live ticket chat</h5>
          <small className="text-muted">Collaborate with support in real time.</small>
        </div>
        <StatusBadge status={status || 'Open'} />
      </div>

      <div className="flex-grow-1 overflow-auto mb-3 chat-history" style={{ minHeight: 260 }}>
        {messages.map((message, index) => (
          <div key={index} className={`mb-3 ${message.sender === 'me' ? 'text-end' : ''}`}>
            <p className="mb-1 small text-muted">{message.senderLabel}</p>
            <div className={`d-inline-block p-3 rounded-4 ${message.sender === 'me' ? 'bg-primary text-white' : 'bg-white bg-opacity-10 text-white'}`}>
              {message.text}
            </div>
            <div className="small text-muted mt-1">{new Date(message.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="d-flex gap-2">
        <input
          className="form-control bg-transparent text-white"
          placeholder="Type your message..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button type="submit" className="btn btn-primary px-4">Send</button>
      </form>
    </div>
  );
}
