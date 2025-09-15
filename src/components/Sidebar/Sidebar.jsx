import React from "react";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <ul>
        <li>Dashboard</li>
        <li>Schedule</li>
        <li>Peer Group</li>
        <li>Analytics</li>
        <li>Resource Hub</li>
        <li>Logout</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
