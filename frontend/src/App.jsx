
import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All Tasks");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("taskflow-theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("taskflow-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  async function loadTasks() {
    try {
      setError("");
      setTasks(await getTasks());
    } catch {
      setError("Could not load tasks. Check that the backend and MySQL are running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;

    const task = {
      title: title.trim(),
      description: description.trim(),
    };

    try {
      setError("");

      if (editingId !== null) {
        const existing = tasks.find((item) => item.id === editingId);
        await updateTask(editingId, {
          ...task,
          status: existing?.status || "To Do",
        });
      } else {
        await createTask(task);
      }

      setTitle("");
      setDescription("");
      setEditingId(null);
      await loadTasks();
    } catch {
      setError("Could not save the task. Please try again.");
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function changeStatus(task, status) {
    try {
      await updateTask(task.id, {
        title: task.title,
        description: task.description || "",
        status,
      });
      await loadTasks();
    } catch {
      setError("Could not update task status.");
    }
  }

  async function removeTask(id) {
    if (!window.confirm("Delete this task permanently?")) return;

    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.message || "Could not delete task.");
    }
  }

  function cancelEditing() {
    setEditingId(null);
    setTitle("");
    setDescription("");
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All Tasks") return true;
    return task.status === filter;
  });

  const completed = tasks.filter((task) => task.status === "Completed").length;
  const inProgress = tasks.filter((task) => task.status === "In Progress").length;
  const todo = tasks.filter((task) => task.status === "To Do").length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✓</span> TaskFlow
        </div>

        <p className="nav-label">WORKSPACE</p>

        {["All Tasks", "To Do", "In Progress", "Completed"].map((item) => (
          <button
            key={item}
            className={`nav-item ${filter === item ? "active" : ""}`}
            onClick={() => setFilter(item)}
          >
            <span>
              {item === "All Tasks"
                ? "▦"
                : item === "To Do"
                  ? "○"
                  : item === "In Progress"
                    ? "◷"
                    : "✓"}
            </span>
            {item}
            {item === "All Tasks" && (
              <span className="nav-count">{tasks.length}</span>
            )}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="profile-avatar">LK</div>
          <div>
            <strong>My Workspace</strong>
            <small>Personal account</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">WORKSPACE / TASKS</span>
            <h1>My Tasks</h1>
          </div>

          <div className="topbar-actions">
            <span className="today-label">● Workspace active</span>
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={darkMode}
            >
              {darkMode ? "☀️ Light mode" : "🌙 Dark mode"}
            </button>
          </div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR PRODUCTIVITY SPACE</p>
            <h2>Make today count.</h2>
            <p>Plan your work, track your progress, and get things done.</p>
          </div>
          <div className="welcome-mark">✓</div>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <span>Total tasks</span>
            <strong>{tasks.length}</strong>
            <small>Across your workspace</small>
          </article>
          <article className="stat-card">
            <span>To do</span>
            <strong>{todo}</strong>
            <small>Waiting to get started</small>
          </article>
          <article className="stat-card">
            <span>In progress</span>
            <strong>{inProgress}</strong>
            <small>Work underway</small>
          </article>
          <article className="stat-card">
            <span>Completed</span>
            <strong>{completed}</strong>
            <small>
              {tasks.length
                ? Math.round((completed / tasks.length) * 100)
                : 0}
              % completion rate
            </small>
          </article>
        </section>

        <section className="content-grid">
          <div className="panel tasks-panel">
            <div className="section-heading">
              <div>
                <h2>{filter}</h2>
                <p>Manage your work in one place.</p>
              </div>
              <span className="result-count">{filteredTasks.length} tasks</span>
            </div>

            {error && <p className="error" role="alert">{error}</p>}
            {loading && <p>Loading tasks...</p>}

            {!loading && filteredTasks.length === 0 && (
              <div className="empty-state">
                <span>✦</span>
                <h3>No tasks here yet</h3>
                <p>Add a task using the form to get started.</p>
              </div>
            )}

            <div className="task-list">
              {filteredTasks.map((task) => (
                <article className="task-card" key={task.id}>
                  <div className="task-main">
                    <span
                      className={`task-dot ${
                        task.status === "Completed"
                          ? "done"
                          : task.status === "In Progress"
                            ? "working"
                            : ""
                      }`}
                    />
                    <div className="task-copy">
                      <h3>{task.title}</h3>
                      <p>{task.description || "No description added"}</p>
                      <span
                        className={`status-badge ${task.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <div className="task-actions">
                    <select
                      aria-label={`Change status for ${task.title}`}
                      value={task.status}
                      onChange={(event) =>
                        changeStatus(task, event.target.value)
                      }
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                    <button
                      className="icon-button"
                      title="Edit task"
                      aria-label={`Edit ${task.title}`}
                      onClick={() => startEdit(task)}
                    >
                      ✎
                    </button>
                    <button
                      className="icon-button delete-button"
                      title="Delete task"
                      aria-label={`Delete ${task.title}`}
                      onClick={() => removeTask(task.id)}
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="panel form-panel">
            <h2>{editingId !== null ? "Edit task" : "Create a task"}</h2>
            <p className="form-intro">Capture your next priority.</p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="task-title">Task title</label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Learn Docker"
                required
              />

              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add a few details..."
                rows="4"
              />

              <button className="primary-button" type="submit">
                {editingId !== null ? "Save changes" : "+ Add task"}
              </button>

              {editingId !== null && (
                <button
                  className="cancel-button"
                  type="button"
                  onClick={cancelEditing}
                >
                  Cancel editing
                </button>
              )}
            </form>
          </aside>
        </section>

        <footer className="footer">
          TaskFlow <span>·</span> Stay focused. Make progress.
        </footer>
      </main>
    </div>
  );
}

export default App;

