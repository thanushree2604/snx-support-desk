import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="login-background"></div>
      
      <nav className="landing-navbar">
        <div className="container-fluid px-4 py-3 d-flex justify-content-between align-items-center">
          <div className="landing-brand d-flex align-items-center gap-3">
            <img src="/snx-logo.svg" alt="SNX Support Desk Logo" style={{ height: '50px', width: 'auto' }} />
            <div>
              <h2 className="mb-0">SNX Support Desk</h2>
              <p className="text-muted small mb-0">Smart IT Service Management Platform</p>
            </div>
          </div>
          <div className="gap-2 d-flex align-items-center">
            <a className="btn btn-outline-light" href="#support-team">Support Team</a>
            <button className="btn btn-outline-light" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>Register</button>
          </div>
        </div>
      </nav>

      <div className="landing-hero">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="landing-content">
                <h1 className="display-3 fw-bold mb-4">SNX Support Desk</h1>
                <p className="lead text-muted mb-4">
                  Smart IT Service Management Platform for managing support tickets, live conversations, and team collaboration in one powerful workflow.
                </p>
                <div className="d-flex gap-3 mb-5">
                  <button className="btn btn-primary btn-lg px-5" onClick={() => navigate('/register')}>
                    Get Started
                  </button>
                  <button className="btn btn-outline-light btn-lg px-5" onClick={() => navigate('/login')}>
                    Sign In
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="landing-features">
                <div className="feature-item mb-4">
                  <div className="feature-icon mb-3">📋</div>
                  <h5>Ticket Management</h5>
                  <p className="text-muted small">Create, track, and resolve support tickets with priorities and categories</p>
                </div>
                <div className="feature-item mb-4">
                  <div className="feature-icon mb-3">💬</div>
                  <h5>Live Chat</h5>
                  <p className="text-muted small">Real-time communication with support staff and customers</p>
                </div>
                <div className="feature-item mb-4">
                  <div className="feature-icon mb-3">📊</div>
                  <h5>Analytics Dashboard</h5>
                  <p className="text-muted small">Track ticket metrics, response times, and team performance</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon mb-3">👥</div>
                  <h5>Team Collaboration</h5>
                  <p className="text-muted small">Assign tickets, leave notes, and track progress together</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="landing-workspace py-5">
        <div className="container">
          <div className="row gy-4 align-items-center">
            <div className="col-lg-5">
              <div className="landing-stat-card p-4 mb-4">
                <h5>Live insight at a glance</h5>
                <p className="text-muted small">
                  Visualize ticket volume, agent performance, and response trends from a polished enterprise dashboard.
                </p>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="stat-pill">
                      <span>128</span>
                      <small>Open Tickets</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-pill stat-pill-success">
                      <span>94%</span>
                      <small>Response Rate</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-pill stat-pill-warning">
                      <span>36</span>
                      <small>Assigned</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-pill stat-pill-info">
                      <span>67</span>
                      <small>Resolved</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="landing-dashboard-graphic p-4">
                <div className="dashboard-header d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <p className="text-muted small mb-1">Platform Snapshot</p>
                    <h5 className="mb-0">Ticket performance overview</h5>
                  </div>
                  <span className="badge bg-primary text-white">Real-time</span>
                </div>
                <div className="dashboard-chart mb-4">
                  <div className="chart-bar active" style={{ height: '78%' }}><span>Open</span></div>
                  <div className="chart-bar" style={{ height: '62%' }}><span>Assigned</span></div>
                  <div className="chart-bar" style={{ height: '48%' }}><span>In Progress</span></div>
                  <div className="chart-bar" style={{ height: '82%' }}><span>Resolved</span></div>
                  <div className="chart-bar" style={{ height: '28%' }}><span>Closed</span></div>
                </div>
                <div className="dashboard-lead d-flex gap-3 justify-content-between">
                  <div>
                    <p className="text-muted small mb-1">CSAT</p>
                    <h4 className="mb-0">4.8/5</h4>
                  </div>
                  <div>
                    <p className="text-muted small mb-1">Avg. Response</p>
                    <h4 className="mb-0">16m</h4>
                  </div>
                  <div>
                    <p className="text-muted small mb-1">Backlog</p>
                    <h4 className="mb-0">18</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="support-team" className="landing-support-team row gy-4 mt-5">
            <div className="col-12">
              <div className="section-heading mb-4">
                <p className="text-muted small mb-2">Support Team Structure</p>
                <h3>Recommended Support Roles</h3>
                <p className="text-muted">Organize your team with clear escalation tiers for fast, efficient ticket handling.</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="info-card p-4 h-100 bg-panel">
                <h5 className="mb-3">L1 Support</h5>
                <ul className="list-unstyled text-muted small mb-0">
                  <li>• Password reset</li>
                  <li>• Basic troubleshooting</li>
                  <li>• Ticket triage</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="info-card p-4 h-100 bg-panel">
                <h5 className="mb-3">L2 Support</h5>
                <ul className="list-unstyled text-muted small mb-0">
                  <li>• Hardware/software issues</li>
                  <li>• Desktop support</li>
                  <li>• Application support</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="info-card p-4 h-100 bg-panel">
                <h5 className="mb-3">L3 Support</h5>
                <ul className="list-unstyled text-muted small mb-0">
                  <li>• Network/server issues</li>
                  <li>• Infrastructure</li>
                  <li>• Advanced escalations from admin assignment</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="landing-ticket-contributors row gy-4 mt-5">
            <div className="col-12">
              <div className="section-heading mb-4">
                <p className="text-muted small mb-2">Ticket Sources</p>
                <h3>Who Can Raise Tickets?</h3>
                <p className="text-muted">SNX Support Desk captures issues from every level of your organization so the right team can respond fast.</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="info-card p-4 h-100 bg-panel">
                <h5 className="mb-3">End Users</h5>
                <ul className="list-unstyled text-muted small mb-0">
                  <li>• Hardware issues</li>
                  <li>• Software issues</li>
                  <li>• Access requests</li>
                  <li>• Network issues</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="info-card p-4 h-100 bg-panel">
                <h5 className="mb-3">Admin</h5>
                <ul className="list-unstyled text-muted small mb-0">
                  <li>• Internal IT incidents</li>
                  <li>• System outages</li>
                  <li>• Security alerts</li>
                  <li>• Maintenance tasks</li>
                  <li>• Escalation tickets</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="info-card p-4 h-100 bg-panel">
                <h5 className="mb-3">Support Staff</h5>
                <ul className="list-unstyled text-muted small mb-0">
                  <li>• Vendor escalation</li>
                  <li>• Infrastructure issues</li>
                  <li>• Internal technical requests</li>
                  <li>• Cross-team dependency tickets</li>
                  <li>• Major incident reports</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="landing-testimonials row gy-4 mt-5">
            <div className="col-lg-4">
              <div className="testimonial-card p-4">
                <p className="testimonial-text">“SNX Support Desk transformed our ticket process overnight. The analytics and chat workflow are incredibly intuitive.”</p>
                <div className="testimonial-meta mt-3">
                  <strong>Jasmine Patel</strong>
                  <span className="text-muted small">IT Manager, Global Campus</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="testimonial-card p-4">
                <p className="testimonial-text">“The admin dashboard gives our team full control over SLA tracking and ticket resolution timelines.”</p>
                <div className="testimonial-meta mt-3">
                  <strong>Marcus Lee</strong>
                  <span className="text-muted small">Support Lead, FinTech</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="testimonial-card p-4">
                <p className="testimonial-text">“A premium solution for enterprise support teams — modern interface, fast workflows, and great reporting.”</p>
                <div className="testimonial-meta mt-3">
                  <strong>Laura Kim</strong>
                  <span className="text-muted small">Operations Director</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="landing-cta py-5 bg-dark border-top border-secondary">
        <div className="container text-center">
          <h3 className="mb-4">Ready to streamline your support?</h3>
          <p className="text-muted mb-4">Join teams already using SNX Support Desk to manage customer support efficiently.</p>
          <button className="btn btn-primary btn-lg px-5" onClick={() => navigate('/register')}>
            Start Free Today
          </button>
        </div>
      </div>
    </div>
  );
}
