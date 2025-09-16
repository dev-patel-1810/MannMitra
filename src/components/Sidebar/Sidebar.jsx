import React from "react";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <ul>
        <li className="sidebar-item">Dashboard</li>
        <li className="sidebar-item">Schedule</li>
        <li className="sidebar-item">Peer Group</li>
        <li className="sidebar-item">Analytics</li>
        <li className="sidebar-item">Resource Hub</li>
        <li className="sidebar-item">Logout</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
