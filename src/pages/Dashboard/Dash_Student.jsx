import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import MoodCard from "../../components/MoodCard/MoodCard";
import ChatPrompt from "../../components/ChatPrompt/ChatPrompt";
import ModuleCard from "../../components/ModuleCard/ModuleCard";
import ExploreSection from "../../components/ExploreSection/ExploreSection";
import ResourceHub from "../../components/ResourceHub/ResourceHub";
import Schedule from "../../components/Schedule/Schedule";
import WellnessTasks from "../../components/WellnessTasks/WellnessTasks";
import { useNavigate } from "react-router-dom";

// Import module icons
import peerIcon from '../../assets/peer_group.jpg';
import counselorIcon from '../../assets/your_counsellor.jpg';
import analyticsIcon from '../../assets/analytics.jpg';
import testIcon from '../../assets/take_test.jpg';

import "./Dash_Student.css";

const Dash_Student = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const modules = [
    { title: 'Peer Group', icon: peerIcon, color: '#B63C65' },
    { title: 'Counsellor', icon: counselorIcon, color: '#2653A0' },
    { title: 'Analytics', icon: analyticsIcon, color: '#54BABE' },
    { title: 'Take Test', icon: testIcon, color: '#FAAF18', onClick: () => navigate("/ghq12-test") }
  ];

  return (
    <div className={`dashboard ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="dashboard-body">
        <Sidebar isOpen={sidebarOpen} />

        <main className="dashboard-main">
          <div className="dashboard-content">
            <MoodCard />
            <ChatPrompt />
            
            <div className="modules-grid">
              {modules.map((module, index) => (
                <ModuleCard
                  key={index}
                  title={module.title}
                  icon={module.icon}
                  color={module.color}
                  onClick={module.onClick}
                />
              ))}
            </div>

            <ExploreSection />
            <ResourceHub />
          </div>
        </main>

        <aside className="dashboard-right">
          <Schedule />
          <WellnessTasks />
        </aside>
      </div>
    </div>
  );
};

export default Dash_Student;
