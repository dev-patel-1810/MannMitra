import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WellnessForest.css";

const TASK_POOL = [
  "Morning meditation (5-10 min)",
  "Write a short journal entry",
  "Move for 15 minutes (walk/stretch)",
  "Check-in with a friend",
  "Practice deep breathing for 3 minutes",
  "Read 5 pages of a book",
  "Drink 2 glasses of water",
  "List 3 things you’re grateful for",
  "Take a 10-min walk outside",
];

const todayKey = () => new Date().toISOString().slice(0, 10);
const monthKey = () => new Date().toISOString().slice(0, 7);
const makeId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
const MONTH_KEY_PREFIX = "wellness_forest_currentMonth";
const HISTORY_KEY = "wellness_forest_history";
const MAX_TREES = 100;

// Pick 3 random tasks for today
const pickDailyTasks = () => {
  const tk = todayKey();
  return TASK_POOL.sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((t, i) => ({
      id: `task_${i}_${tk}`,
      text: t,
      done: false,
      treeId: null,
    }));
};

// Small tree sprite with style variations 🌳
const SmallTree = ({ x, y, id, variant }) => {
  const colors = [
    { main: "#9bce8f", side: "#85c06b" },
    { main: "#a2d48a", side: "#7bbf5f" },
    { main: "#8ecf9a", side: "#6fbf7a" },
  ];
  const { main, side } = colors[variant % colors.length];

  return (
    <div className="wf-tree" style={{ left: x, top: y }} data-id={id}>
      <svg viewBox="0 0 36 48" width="36" height="48" aria-hidden>
        <rect x="16" y="34" width="4" height="10" rx="1" fill="#7a5c3f" />
        <g>
          <ellipse cx="18" cy="20" rx="14" ry="12" fill={main} />
          <ellipse cx="10" cy="14" rx="7" ry="6" fill={side} />
          <ellipse cx="26" cy="14" rx="7" ry="6" fill={side} />
        </g>
      </svg>
    </div>
  );
};

const WellnessForest = () => {
  const navigate = useNavigate();
  const forestRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const [currentMonthData, setCurrentMonthData] = useState({
    monthKey: monthKey(),
    trees: [],
  });
  const [history, setHistory] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Initial load: tasks, forest, history
  useEffect(() => {
    const logged = Boolean(localStorage.getItem("user"));
    setIsLoggedIn(logged);
    if (!logged) setShowLoginOverlay(true);

    const his = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    setHistory(his);

    const stored = JSON.parse(localStorage.getItem(MONTH_KEY_PREFIX) || "null");
    const nowMonth = monthKey();

    if (!stored || stored.monthKey !== nowMonth) {
      if (stored && Array.isArray(stored.trees)) {
        const prevCount = stored.trees.length;
        const newHist = [...his, { monthKey: stored.monthKey, count: prevCount }];
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHist));
        setHistory(newHist);
      }
      const fresh = { monthKey: nowMonth, trees: [] };
      localStorage.setItem(MONTH_KEY_PREFIX, JSON.stringify(fresh));
      setCurrentMonthData(fresh);
    } else {
      setCurrentMonthData(stored);
    }

    const tk = todayKey();
    const storedTasks = JSON.parse(localStorage.getItem(`wellness_tasks_${tk}`) || "null");
    if (storedTasks && Array.isArray(storedTasks.tasks)) {
      setTasks(storedTasks.tasks);
    } else {
      const initial = pickDailyTasks();
      localStorage.setItem(`wellness_tasks_${tk}`, JSON.stringify({ tasks: initial }));
      setTasks(initial);
    }

    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const midnightTimer = setTimeout(() => {
      window.location.reload();
    }, msUntilMidnight + 1000);

    return () => clearTimeout(midnightTimer);
  }, []);

  useEffect(() => {
    localStorage.setItem(MONTH_KEY_PREFIX, JSON.stringify(currentMonthData));
  }, [currentMonthData]);

  useEffect(() => {
    const tk = todayKey();
    localStorage.setItem(`wellness_tasks_${tk}`, JSON.stringify({ tasks }));
  }, [tasks]);

  // Plant tree in random position
  const plantTree = () => {
    const container = forestRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();

    const spriteW = 36,
      spriteH = 48,
      pad = 12;
    const existing = currentMonthData.trees || [];
    let chosen = null;

    for (let a = 0; a < 20; a++) {
      const x = Math.floor(Math.random() * Math.max(1, rect.width - spriteW - pad * 2)) + pad;
      const y = Math.floor(Math.random() * Math.max(1, rect.height - spriteH - pad * 2)) + pad;
      const tooClose = existing.some((t) => {
        const dx = t.x - x,
          dy = t.y - y;
        return dx * dx + dy * dy < 36 * 36;
      });
      if (!tooClose) {
        chosen = { x, y };
        break;
      }
    }
    if (!chosen) {
      chosen = {
        x: Math.floor(Math.random() * Math.max(1, rect.width - spriteW - pad * 2)) + pad,
        y: Math.floor(Math.random() * Math.max(1, rect.height - spriteH - pad * 2)) + pad,
      };
    }

    const newTree = {
      id: makeId(),
      x: chosen.x,
      y: chosen.y,
      variant: Math.floor(Math.random() * 3), // pick random sprite
      timestamp: Date.now(),
    };
    const newList = [...(currentMonthData.trees || []), newTree].slice(0, MAX_TREES);
    const updated = { ...currentMonthData, trees: newList };
    setCurrentMonthData(updated);
    return newTree;
  };

  // Toggle task completion
  const toggleTask = (taskId) => {
    if (!isLoggedIn) {
      setShowLoginOverlay(true);
      return;
    }

    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        if (!t.done) {
          const newTree = plantTree();
          return { ...t, done: true, treeId: newTree?.id };
        } else {
          if (t.treeId) {
            setCurrentMonthData((prev) => ({
              ...prev,
              trees: prev.trees.filter((tree) => tree.id !== t.treeId),
            }));
          }
          return { ...t, done: false, treeId: null };
        }
      }
      return t;
    });

    setTasks(updatedTasks);
  };

  // Refresh tasks
  const refreshTasks = () => {
    const tk = todayKey();
    const newSet = pickDailyTasks();
    localStorage.setItem(`wellness_tasks_${tk}`, JSON.stringify({ tasks: newSet }));
    setTasks(newSet);
  };

  // Reset month
  const clearMonth = () => {
    const stored = currentMonthData;
    if (stored && stored.monthKey) {
      const prevCount = (stored.trees || []).length;
      const newHist = [...history, { monthKey: stored.monthKey, count: prevCount }];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHist));
      setHistory(newHist);
    }
    const fresh = { monthKey: monthKey(), trees: [] };
    localStorage.setItem(MONTH_KEY_PREFIX, JSON.stringify(fresh));
    setCurrentMonthData(fresh);
  };

  // Overlay actions
  const handleLogin = () => navigate("/login");
  const continueGuest = () => setShowLoginOverlay(false);

  return (
    <div className="wf-page">
      {showLoginOverlay && !isLoggedIn && (
        <div className="wf-overlay">
          <div className="wf-overlay-card">
            <h3>Login to Save Progress</h3>
            <p>
              To sync your forest across devices and months, please log in. You can also continue as
              a guest (local storage only).
            </p>
            <div className="wf-overlay-actions">
              <button className="btn primary" onClick={handleLogin}>
                Login
              </button>
              <button className="btn secondary" onClick={continueGuest}>
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="wf-container">
        {/* Left: Forest */}
        <div className="wf-left">
          <div className="wf-left-header">
            <h2>Your Forest</h2>
            <div className="wf-stats">
              <div>
                Month: <strong>{currentMonthData.monthKey}</strong>
              </div>
              <div>
                Trees grown: <strong>{currentMonthData.trees.length}</strong>
              </div>
            </div>
          </div>

          <div className="wf-forest" ref={forestRef} aria-live="polite" role="region">
            <div className="wf-ground" />
            {currentMonthData.trees.map((t) => (
              <SmallTree key={t.id} x={t.x} y={t.y} id={t.id} variant={t.variant || 0} />
            ))}
            {currentMonthData.trees.length === 0 && (
              <div className="wf-empty">
                <p>No trees yet — complete daily tasks to plant your forest 🌱</p>
                <button className="btn" onClick={() => (isLoggedIn ? plantTree() : setShowLoginOverlay(true))}>
                  Plant First Tree
                </button>
              </div>
            )}
          </div>

          <div className="wf-history">
            <h4>History</h4>
            {history.length === 0 ? (
              <p className="muted small">No previous months yet.</p>
            ) : (
              <ul>
                {history.slice(-6).reverse().map((h) => (
                  <li key={h.monthKey}>
                    <strong>{h.monthKey}</strong>: {h.count} trees
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right: Tasks + Controls */}
        <div className="wf-right">
          <div className="wf-tasks-card">
            <h3>
              Today's Tasks <span className="muted">({todayKey()})</span>
            </h3>
            <ul className="wf-tasks">
              {tasks.map((t) => (
                <li key={t.id} className={`task-item ${t.done ? "done" : ""}`}>
                  <label>
                    <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                    <span className="task-text">{t.text}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="wf-task-actions">
              <button className="btn" onClick={refreshTasks}>
                Refresh Tasks
              </button>
            </div>
          </div>

          <div className="wf-controls-card">
            <h3>Controls</h3>
            <div className="wf-controls">
              <button className="btn" onClick={plantTree}>
                Plant a Tree
              </button>
              <button className="btn secondary" onClick={clearMonth}>
                End Month (Archive & Reset)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessForest;
