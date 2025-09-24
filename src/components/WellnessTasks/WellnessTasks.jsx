import React from 'react';
import './WellnessTasks.css';
import defaultProfile from '../../assets/wellness_Task1.png';
import {t} from 'i18next';
const WellnessTasks = () => {
  const tasks = [
    { id: 1, task: t('dashboard.task_1'), completed: true },
    { id: 2, task: t('dashboard.task_2'), completed: false },
    { id: 3, task: t('dashboard.task_3'), completed: false }
  ];

  return (
    <div className="wellness-tasks">
      <h2>{t('dashboard.wellness_tasks')}</h2>
      <div className="tasks-list">
        {tasks.map(task => (
          <div key={task.id} className="task-item">
            <div className="task-info">
              <img src={defaultProfile} alt={t('dashboard.profile')} className="task-profile" />
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
