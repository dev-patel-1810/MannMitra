import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import {t} from 'i18next';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm(t('dashboard.confirm_logout'))) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <ul>
        <li className="sidebar-item">{t('dashboard.dashboard')}</li>
        <li className="sidebar-item">{t('dashboard.schedule')}</li>
        <li className="sidebar-item">{t('dashboard.peer')}</li>
        <li className="sidebar-item">{t('dashboard.analytics')}</li>
        <li className="sidebar-item">{t('dashboard.resource_hub')}</li>
        <li className="sidebar-item" onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
          {t('dashboard.logout')}
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
