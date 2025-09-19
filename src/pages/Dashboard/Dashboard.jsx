import React from 'react';
import './Dashboard.css';
import MoodCard from '../../components/MoodCard/MoodCard';
import ChatPrompt from '../../components/ChatPrompt/ChatPrompt';
import ModuleCard from '../../components/ModuleCard/ModuleCard';
import peerIcon from '../../assets/peer group.png';
import counselorIcon from '../../assets/counsellor.png';
import analyticsIcon from '../../assets/analytics.png';
import testIcon from '../../assets/take test.png';
import profile1 from '../../assets/profile1.png';
import profile2 from '../../assets/profile2.png';
import profile3 from '../../assets/profile3.png';

const Dashboard = () => {
  const modules = [
    { title: 'Peer Group', icon: peerIcon, color: '#B63C65' },
    { title: 'Counsellor', icon: counselorIcon, color: '#2653A0' },
    { title: 'Analytics', icon: analyticsIcon, color: '#54BABE' },
    { title: 'Take Test', icon: testIcon, color: '#FAAF18' }
  ];

  const wellnessTasks = [
    { id: 1, task: 'Complete daily mood check-in', completed: true, image: profile1 },
    { id: 2, task: 'Join peer support group', completed: false, image: profile2 },
    { id: 3, task: 'Schedule counseling session', completed: false, image: profile3 }
  ];

  return (
    <div className="dashboard">
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
            />
          ))}
        </div>

        <div className="wellness-tasks">
          <h2>Wellness Tasks</h2>
          <div className="tasks-list">
            {wellnessTasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <img src={task.image} alt="Profile" className="task-profile" />
                  <span className="task-text">{task.task}</span>
                </div>
                <div className="task-status">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    readOnly
                    className="task-checkbox"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;