import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <ul>
        <li className="sidebar-item">Dashboard</li>
        <li className="sidebar-item">Schedule</li>
        <li className="sidebar-item">Peer Group</li>
        <li className="sidebar-item">Analytics</li>
        <li className="sidebar-item">Resource Hub</li>
        <li className="sidebar-item" onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
          Logout
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
