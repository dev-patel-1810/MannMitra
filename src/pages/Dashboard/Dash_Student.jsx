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

import "./Dash_Student.css";

const Dash_Student = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className={`dashboard ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="dashboard-body">
        <Sidebar isOpen={sidebarOpen} />

        <main className="dashboard-main">
          <section className="top-section">
            <MoodCard />
            {/* <AppointmentCard /> */}
          </section>

          <ChatPrompt />

          <section className="modules">
            <ModuleCard title="Peer Group" className="module-peer" />
            <ModuleCard title="Your Counselor" className="module-counselor" />
            <ModuleCard title="Analytics" className="module-analytics" />
            
            {/* Navigate to GHQ12 test page */}
            <ModuleCard 
              title="Take Test" 
              className="module-test"
              
              onClick={() => navigate("/ghq12-test")}
            />
          </section>

          <ExploreSection />
          <ResourceHub />
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
