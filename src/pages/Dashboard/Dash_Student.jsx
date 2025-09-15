import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import MoodCard from "../../components/MoodCard/MoodCard";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import ChatPrompt from "../../components/ChatPrompt/ChatPrompt";
import ModuleCard from "../../components/ModuleCard/ModuleCard";
import ExploreSection from "../../components/ExploreSection/ExploreSection";
import ResourceHub from "../../components/ResourceHub/ResourceHub";
import Schedule from "../../components/Schedule/Schedule";
import WellnessTasks from "../../components/WellnessTasks/WellnessTasks";

import "./Dash_Student.css";

const Dash_Student = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`dashboard ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Top Navbar with Hamburger */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="dashboard-body">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Main Content */}
        <main className="dashboard-main">
          <section className="top-section">
            <MoodCard />
            <AppointmentCard />
          </section>

          <ChatPrompt />

          <section className="modules">
            <ModuleCard title="Peer Group" />
            <ModuleCard title="Your Counselor" />
            <ModuleCard title="Analytics" />
            <ModuleCard title="Task Test" />
          </section>

          <ExploreSection />
          <ResourceHub />
        </main>

        {/* Right Sidebar (Schedule & Wellness Tasks) */}
        <aside className="dashboard-right">
          <Schedule />
          <WellnessTasks />
        </aside>
      </div>
    </div>
  );
};

export default Dash_Student;
