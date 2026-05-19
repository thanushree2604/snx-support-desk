import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import RoleBadge from '../components/RoleBadge';

export default function CreateTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data);
      if (response.data.length) {
        setCategoryId(response.data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !categoryId) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await API.post('/tickets', {
        title: title.trim(),
        description: description.trim(),
        category_id: categoryId,
        priority
      });
      alert('Ticket created successfully!');
      navigate('/dashboard', { state: { refresh: Date.now() } });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create ticket.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    fetchCategories();
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
              <p className="text-muted mb-1">Create New Ticket</p>
              <h2 className="mb-0">
                Support Request
                <RoleBadge role={role} />
              </h2>
            </div>
            <button className="btn btn-outline-light" onClick={handleCancel}>Back to Dashboard</button>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="bg-panel p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-bold">Ticket Title *</label>
                    <input
                      type="text"
                      className="form-control form-control-lg bg-dark text-white border-0"
                      placeholder="Brief description of your issue"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <small className="text-muted">Be specific so our team can help quickly</small>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Category *</label>
                      <select
                        className="form-select form-select-lg bg-dark text-white border-0"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        disabled={loading}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Priority *</label>
                      <select
                        className="form-select form-select-lg bg-dark text-white border-0"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        disabled={loading}
                        required
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Description *</label>
                    <textarea
                      className="form-control bg-dark text-white border-0"
                      placeholder="Describe your issue in detail. Include any error messages or steps to reproduce the problem."
                      rows="8"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <small className="text-muted">The more details you provide, the faster we can resolve your issue</small>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-4"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-light btn-lg px-4"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-panel p-4">
                <h5 className="mb-3">Tips for a Great Ticket</h5>
                <ul className="text-muted small">
                  <li className="mb-2"><strong>Be specific:</strong> Describe exactly what the problem is</li>
                  <li className="mb-2"><strong>Include details:</strong> Add error messages, screenshots, or steps to reproduce</li>
                  <li className="mb-2"><strong>Set priority:</strong> Choose the right priority level</li>
                  <li className="mb-2"><strong>Select category:</strong> Choose the most relevant category</li>
                  <li><strong>Monitor status:</strong> Return to dashboard to track responses</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
