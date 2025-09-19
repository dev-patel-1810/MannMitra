import React from 'react';
import './WellnessTasks.css';
import defaultProfile from '../../assets/wellness_task.png';

const WellnessTasks = () => {
  const tasks = [
    { id: 1, task: 'Complete daily mood check-in', completed: true },
    { id: 2, task: 'Join peer support group', completed: false },
    { id: 3, task: 'Schedule counseling session', completed: false }
  ];

  return (
    <div className="wellness-tasks">
      <h2>Wellness Tasks</h2>
      <div className="tasks-list">
        {tasks.map(task => (
          <div key={task.id} className="task-item">
            <div className="task-info">
              <img src={defaultProfile} alt="Profile" className="task-profile" />
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
  );
};

export default WellnessTasks;
