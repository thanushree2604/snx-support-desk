import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-fluid page-shell py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="bg-panel p-5 text-center glass-card">
            <h1 className="display-4">404</h1>
            <p className="lead text-muted">Page not found. The support dashboard route may have been moved.</p>
            <Link to="/" className="btn btn-primary mt-3">Return to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
