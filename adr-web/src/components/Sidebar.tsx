import { useState } from 'react';
import Link from 'next/link';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav
        className={`col-md-3 d-md-block bg-light sidebar collapse ${
          isOpen ? 'show' : ''
        }`}
      >
        <div className="position-sticky pt-3">
          <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>Mis repositorios</span>
          </h6>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="/dashboard">
                <span className="nav-link">
                  <i className="bi bi-speedometer2"></i> Dashboard
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/treeview">
                <span className="nav-link">
                  <i className="bi bi-folder"></i> Tree View
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/timeline">
                <span className="nav-link">
                  <i className="bi bi-folder"></i> Timeline View
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <button
        className={`btn btn-link btn-sm position-absolute top-0 start-100 translate-middle ${
          isOpen ? 'bi bi-x-lg' : 'bi bi-list'
        }`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="visually-hidden">Toggle sidebar</span>
      </button>
    </>
  );
}

export default Sidebar;

