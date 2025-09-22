// src/pages/WellnessForest/WellnessForest.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WellnessForest.css";
import { useTranslation } from 'react-i18next';
import {t} from 'i18next'
function About() {
  const { t } = useTranslation();
}
const TASK_POOL = [
  t('wellness_forest.morning_meditation'),
  t('wellness_forest.write_journal_entry'),
  t('wellness_forest.move_for_15_minutes'),
  t('wellness_forest.check_in_with_friend'),
  t('wellness_forest.practice_deep_breathing'),
  t('wellness_forest.read_5_pages_book'),
  t('wellness_forest.drink_2_glasses_water'),
  t('wellness_forest.list_3_things_grateful'),
  t('wellness_forest.take_10_min_walk_outside')
];

const todayKey = () => new Date().toISOString().slice(0, 10);
const monthKey = () => new Date().toISOString().slice(0, 7);
const makeId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
const MONTH_KEY_PREFIX = "wellness_forest_currentMonth";
const HISTORY_KEY = "wellness_forest_history";
const MAX_TREES = 100;

/* pickDailyTasks: do NOT mutate TASK_POOL (copy first) */
const pickDailyTasks = () => {
  const tk = todayKey();
  const pool = [...TASK_POOL]; // copy so we don't mutate the constant
  pool.sort(() => Math.random() - 0.5);
  return pool.slice(0, 3).map((t, i) => ({
    id: `task_${i}_${tk}`,
    text: t,
    done: false,
    treeId: null
  }));
};

const SmallTree = ({ x, y, id, variant = 0 }) => {
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
  const [currentMonthData, setCurrentMonthData] = useState({ monthKey: monthKey(), trees: [] });
  const [history, setHistory] = useState([]);
  const [tasks, setTasks] = useState([]);

  // ----- Helpers that persist immediately -----
  const persistMonth = (monthData) => {
    try { localStorage.setItem(MONTH_KEY_PREFIX, JSON.stringify(monthData)); } catch (e) { /* ignore */ }
  };
  const persistTasks = (tk, tasksArr) => {
    try { localStorage.setItem(`wellness_tasks_${tk}`, JSON.stringify({ tasks: tasksArr })); } catch (e) { /* ignore */ }
  };

  // plantTree uses functional update to avoid stale closure problems
  const plantTree = (givenId = null) => {
    const container = forestRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    const spriteW = 36, spriteH = 48, pad = 12;
    const attempts = 20;

    // choose coords with simple overlap avoidance (reads prev inside updater)
    let chosen;
    // we need to compute coords before we create the tree object, but overlap check must read existing trees:
    const pickCoords = (existing) => {
      for (let a = 0; a < attempts; a++) {
        const x = Math.floor(Math.random() * Math.max(1, rect.width - spriteW - pad * 2)) + pad;
        const y = Math.floor(Math.random() * Math.max(1, rect.height - spriteH - pad * 2)) + pad;
        const tooClose = existing.some((t) => {
          const dx = t.x - x, dy = t.y - y;
          return dx * dx + dy * dy < 36 * 36;
        });
        if (!tooClose) return { x, y };
      }
      // fallback random
      return {
        x: Math.floor(Math.random() * Math.max(1, rect.width - spriteW - pad * 2)) + pad,
        y: Math.floor(Math.random() * Math.max(1, rect.height - spriteH - pad * 2)) + pad
      };
    };

    const newTree = {
      id: givenId || makeId(),
      x: 0,
      y: 0,
      variant: Math.floor(Math.random() * 3),
      timestamp: Date.now()
    };

    // functional update
    setCurrentMonthData((prev) => {
      const existing = prev?.trees || [];
      const coords = pickCoords(existing);
      newTree.x = coords.x;
      newTree.y = coords.y;
      const newList = [...existing, newTree].slice(0, MAX_TREES);
      const updated = { ...prev, trees: newList };
      persistMonth(updated);
      return updated;
    });

    // return the constructed tree object (note: state update is async, but the returned tree has id and coords)
    return newTree;
  };

  const removeTreeById = (id) => {
    setCurrentMonthData((prev) => {
      const newList = (prev.trees || []).filter((t) => t.id !== id);
      const updated = { ...prev, trees: newList };
      persistMonth(updated);
      return updated;
    });
  };

  // ----- Initial load: month & tasks, plus midnight timer -----
  useEffect(() => {
    // login
    const logged = Boolean(localStorage.getItem("user"));
    setIsLoggedIn(logged);
    if (!logged) setShowLoginOverlay(true);

    // history
    const his = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    setHistory(Array.isArray(his) ? his : []);

    // load/rollover month
    const rawMonth = localStorage.getItem(MONTH_KEY_PREFIX);
    let storedMonth = null;
    try { storedMonth = rawMonth ? JSON.parse(rawMonth) : null; } catch (e) { storedMonth = null; }

    const nowMonth = monthKey();
    if (!storedMonth || storedMonth.monthKey !== nowMonth) {
      // archive previous if exists
      if (storedMonth && Array.isArray(storedMonth.trees)) {
        const prevCount = storedMonth.trees.length;
        const newHist = [...(Array.isArray(his) ? his : []), { monthKey: storedMonth.monthKey, count: prevCount }];
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHist));
        setHistory(newHist);
      }
      const fresh = { monthKey: nowMonth, trees: [] };
      setCurrentMonthData(fresh);
      persistMonth(fresh);
    } else {
      setCurrentMonthData(storedMonth);
    }

    // load tasks for today (robust parsing)
    const tk = todayKey();
    const rawTasks = localStorage.getItem(`wellness_tasks_${tk}`);
    let loadedTasks = null;
    try {
      const parsed = rawTasks ? JSON.parse(rawTasks) : null;
      if (parsed && Array.isArray(parsed.tasks) && parsed.tasks.length > 0) {
        loadedTasks = parsed.tasks;
      }
    } catch (e) {
      loadedTasks = null;
    }

    if (!loadedTasks) {
      const initial = pickDailyTasks();
      persistTasks(tk, initial);
      setTasks(initial);
    } else {
      // If some tasks are done and have treeId but the month data doesn't contain those treeIds,
      // replant so the forest matches the task state.
      setTasks(loadedTasks);
      setTimeout(() => {
        const missing = loadedTasks.filter(
          (t) => t.done && t.treeId && !(currentMonthData.trees || []).some(tr => tr.id === t.treeId)
        );
        if (missing.length > 0) {
          const updatedTasks = [...loadedTasks];
          missing.forEach((mTask) => {
            const newTree = plantTree(); // plantTree will persist month
            const idx = updatedTasks.findIndex((x) => x.id === mTask.id);
            if (idx >= 0 && newTree) {
              updatedTasks[idx] = { ...updatedTasks[idx], treeId: newTree.id };
            }
          });
          setTasks(updatedTasks);
          persistTasks(tk, updatedTasks);
        }
      }, 0);
    }

    // midnight refresh: reset tasks at local midnight without touching forest
const now = new Date();
const msUntilMidnight =
  new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
  now.getTime();

const midnightTimer = setTimeout(() => {
  const newKey = todayKey();
  const newTasks = pickDailyTasks();
  persistTasks(newKey, newTasks);
  setTasks(newTasks);
  // forest stays as-is (only resets at month rollover)
}, msUntilMidnight + 1000);

return () => clearTimeout(midnightTimer);
  }, []); // run once

  // persist month whenever it changes (extra safety)
  useEffect(() => {
    persistMonth(currentMonthData);
  }, [currentMonthData]);

  // persist tasks whenever they change
  useEffect(() => {
    const tk = todayKey();
    persistTasks(tk, tasks);
  }, [tasks]);

  // Toggle task completion: plant/remove tree and keep both month + tasks consistent
  const toggleTask = (taskId) => {
    if (!isLoggedIn) {
      setShowLoginOverlay(true);
      return;
    }
  
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const newDone = !t.done;
  
        if (!t.done && newDone && !t.treeId) {
          // ✅ Only plant if no tree already linked
          const newTree = plantTree();
          return { ...t, done: true, treeId: newTree?.id };
        } else if (t.done && !newDone) {
          // ❌ Undoing → remove tree
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
  
    setTasks(updated);
  };
  

  // Refresh tasks (explicit user action). Confirm if tasks already exist to avoid accidental overwrite.
  const refreshTasks = () => {
    const tk = todayKey();
    if (tasks && tasks.length > 0 && !window.confirm("Replace today's tasks with a new random set?")) return;
  
    // Only reset tasks — forest stays intact
    const newSet = pickDailyTasks().map(t => ({ ...t, done: false, treeId: null }));
    setTasks(newSet);
    persistTasks(tk, newSet);
  };
  
  

  const clearMonth = () => {
    const stored = currentMonthData;
    if (stored && stored.monthKey) {
      const prevCount = (stored.trees || []).length;
      const newHist = [...(history || []), { monthKey: stored.monthKey, count: prevCount }];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHist));
      setHistory(newHist);
    }
    const fresh = { monthKey: monthKey(), trees: [] };
    setCurrentMonthData(fresh);
    persistMonth(fresh);
  };

  const handleLogin = () => navigate("/login");
  const continueGuest = () => setShowLoginOverlay(false);

  return (
    <div className="wf-page">
      {showLoginOverlay && !isLoggedIn && (
        <div className="wf-overlay">
          <div className="wf-overlay-card">
            <h3>Login to Save Progress</h3>
            <p>To sync your forest across devices and months, please log in. Or continue as guest (local only).</p>
            <div className="wf-overlay-actions">
              <button className="btn primary" onClick={handleLogin}>Login</button>
              <button className="btn secondary" onClick={continueGuest}>Continue as Guest</button>
            </div>
          </div>
        </div>
      )}

      <div className="wf-container">
        <div className="wf-left">
          <div className="wf-left-header">
            <h2>Your Forest</h2>
            <div className="wf-stats">
              <div>Month: <strong>{currentMonthData.monthKey}</strong></div>
              <div>Trees grown: <strong>{(currentMonthData.trees || []).length}</strong></div>
            </div>
          </div>

          <div className="wf-forest" ref={forestRef} aria-live="polite" role="region">
            <div className="wf-ground" />
            {(currentMonthData.trees || []).map((t) => (
              <SmallTree key={t.id} x={t.x} y={t.y} id={t.id} variant={t.variant} />
            ))}
            {(currentMonthData.trees || []).length === 0 && (
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
            {(!history || history.length === 0) ? <p className="muted small">No previous months yet.</p> :
              <ul>{history.slice(-6).reverse().map(h => <li key={h.monthKey}><strong>{h.monthKey}</strong>: {h.count} trees</li>)}</ul>}
          </div>
        </div>

        <div className="wf-right">
          <div className="wf-tasks-card">
            <h3>Today's Tasks <span className="muted">({todayKey()})</span></h3>
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
              <button className="btn" onClick={refreshTasks}>Refresh Tasks</button>
            </div>
          </div>

          <div className="wf-controls-card">
            <h3>Controls</h3>
            <div className="wf-controls">
              <button className="btn" onClick={() => (isLoggedIn ? plantTree() : setShowLoginOverlay(true))}>Plant a Tree</button>
              <button className="btn secondary" onClick={clearMonth}>End Month (Archive & Reset)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessForest;
