
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/students";

const emptyForm = {
  name: "",
  email: "",
  department: "",
  marks: "",
};

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function loadStudents() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Unable to load students (${response.status})`);
      }

      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        "Could not connect to the backend. Make sure Spring Boot is running on port 8080."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const departments = useMemo(
    () => [
      "All",
      ...new Set(
        students
          .map((student) => student.department)
          .filter(Boolean)
      ),
    ],
    [students]
  );

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = search.toLowerCase();

      const matchesSearch = [
        student.name,
        student.email,
        student.department,
        String(student.id),
      ].some((value) => String(value ?? "").toLowerCase().includes(query));

      const matchesDepartment =
        departmentFilter === "All" ||
        student.department?.toLowerCase() === departmentFilter.toLowerCase();

      return matchesSearch && matchesDepartment;
    });
  }, [students, search, departmentFilter]);

  const averageMarks = students.length
    ? (
        students.reduce((total, student) => total + Number(student.marks || 0), 0) /
        students.length
      ).toFixed(1)
    : "0.0";

  const highPerformers = students.filter(
    (student) => Number(student.marks) >= 75
  ).length;

  function openAddForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(student) {
    setForm({
      name: student.name ?? "",
      email: student.email ?? "",
      department: student.department ?? "",
      marks: String(student.marks ?? ""),
    });
    setEditingId(student.id);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const marks = Number(form.marks);

    if (!form.name.trim() || !form.email.trim() || !form.department.trim()) {
      setError("Please complete all fields.");
      return;
    }

    if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
      setError("Marks must be between 0 and 100.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        editingId !== null ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId !== null ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            department: form.department.trim(),
            marks,
          }),
        }
      );

      if (!response.ok) {
        const details = await response.text();
        throw new Error(
          details || `Request failed with status ${response.status}`
        );
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      setMessage(
        editingId !== null
          ? "Student updated successfully!"
          : "Student added successfully!"
      );

      await loadStudents();
    } catch (err) {
      setError(err.message || "Unable to save student.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(student) {
    const confirmed = window.confirm(
      `Delete ${student.name}'s record? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${student.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Delete failed (${response.status})`);
      }

      setMessage("Student deleted successfully!");
      await loadStudents();
    } catch (err) {
      setError(err.message || "Unable to delete student.");
    }
  }

  function getInitials(name) {
    return String(name || "Student")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");
  }

  function getAvatarColor(name) {
    const colors = ["violet", "blue", "pink", "green", "orange", "cyan"];
    const index = String(name || "").split("").reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0
    );
    return colors[index % colors.length];
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard">
          <span className="brand-icon">S</span>
          <span>
            <strong>Studora</strong>
            <small>STUDENT PORTAL</small>
          </span>
        </a>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="side-nav">
          <a className="nav-item active" href="#dashboard">
            <span>▦</span> Dashboard
          </a>
          <a className="nav-item" href="#students">
            <span>♙</span> Students
          </a>
          <a className="nav-item" href="#analytics">
            <span>▥</span> Analytics
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✦</div>
            <strong>Keep growing!</strong>
            <p>Every student has the potential to shine.</p>
          </div>

          <div className="profile">
            <div className="profile-avatar">A</div>
            <div className="profile-info">
              <strong>Administrator</strong>
              <small>Workspace manager</small>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>Dashboard</strong>
          </div>
          <div className="topbar-right">
            <span className="live-status">
              <span className="status-dot" /> System connected
            </span>
            <div className="top-avatar">A</div>
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <div className="date-label">YOUR EDUCATION OVERVIEW</div>
            <h1>Student Dashboard <span className="wave">✦</span></h1>
            <p>Manage your students, track performance, and celebrate progress.</p>
          </div>

          <button className="primary-button" onClick={openAddForm}>
            <span className="plus-symbol">＋</span> Add New Student
          </button>
        </section>

        {error && (
          <div className="notice error-notice">
            <span>!</span>
            <p>{error}</p>
            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        {message && (
          <div className="notice success-notice">
            <span>✓</span>
            <p>{message}</p>
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        <section className="stats-grid" id="analytics">
          <article className="stat-card stat-purple">
            <div className="stat-top">
              <span>Total Students</span>
              <span className="stat-icon">♙</span>
            </div>
            <div className="stat-number">{students.length}</div>
            <div className="stat-footer">
              <span className="stat-trend">↗</span>
              Registered students
            </div>
            <div className="stat-decoration decoration-one" />
          </article>

          <article className="stat-card stat-blue">
            <div className="stat-top">
              <span>Departments</span>
              <span className="stat-icon">▦</span>
            </div>
            <div className="stat-number">
              {new Set(students.map((s) => s.department).filter(Boolean)).size}
            </div>
            <div className="stat-footer">
              <span className="stat-trend">✦</span>
              Active departments
            </div>
            <div className="stat-decoration decoration-two" />
          </article>

          <article className="stat-card stat-orange">
            <div className="stat-top">
              <span>Average Marks</span>
              <span className="stat-icon">◉</span>
            </div>
            <div className="stat-number">
              {averageMarks}<small>/100</small>
            </div>
            <div className="stat-footer">
              <span className="stat-trend">↗</span>
              Overall performance
            </div>
            <div className="stat-decoration decoration-three" />
          </article>

          <article className="stat-card stat-green">
            <div className="stat-top">
              <span>High Performers</span>
              <span className="stat-icon">✧</span>
            </div>
            <div className="stat-number">{highPerformers}</div>
            <div className="stat-footer">
              <span className="stat-trend">★</span>
              Marks of 75 and above
            </div>
            <div className="stat-decoration decoration-four" />
          </article>
        </section>

        <section className="content-panel" id="students">
          <div className="panel-heading">
            <div>
              <div className="panel-title-row">
                <h2>All Students</h2>
                <span className="count-badge">{filteredStudents.length}</span>
              </div>
              <p>Here's what's happening with your students today.</p>
            </div>

            <button className="secondary-button" onClick={loadStudents}>
              ↻ Refresh
            </button>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search by name, email or ID..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <kbd>⌘ K</kbd>
            </label>

            <label className="filter-box">
              <span>▤</span>
              <select
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
                aria-label="Filter by department"
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department === "All" ? "All Departments" : department}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loader" />
              <p>Loading your students...</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>STUDENT</th>
                    <th>EMAIL ADDRESS</th>
                    <th>DEPARTMENT</th>
                    <th>MARKS</th>
                    <th>PERFORMANCE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => {
                    const marks = Number(student.marks || 0);
                    const color = getAvatarColor(student.name);

                    return (
                      <tr key={student.id}>
                        <td>
                          <div className="student-cell">
                            <div className={`student-avatar ${color}`}>
                              {getInitials(student.name)}
                            </div>
                            <div>
                              <strong>{student.name}</strong>
                              <small>ID #{student.id}</small>
                            </div>
                          </div>
                        </td>
                        <td className="email-cell">{student.email}</td>
                        <td>
                          <span
                            className={`department-badge ${color}`}
                          >
                            {student.department}
                          </span>
                        </td>
                        <td>
                          <strong className="marks-value">{marks}</strong>
                          <span className="marks-total"> / 100</span>
                        </td>
                        <td>
                          <div className="performance-cell">
                            <div className="progress-track">
                              <div
                                className={`progress-fill ${color}`}
                                style={{
                                  width: `${Math.max(0, Math.min(100, marks))}%`,
                                }}
                              />
                            </div>
                            <span
                              className={`performance-label ${
                                marks >= 75
                                  ? "excellent"
                                  : marks >= 50
                                    ? "average"
                                    : "needs-work"
                              }`}
                            >
                              {marks >= 75
                                ? "Excellent"
                                : marks >= 50
                                  ? "Good"
                                  : "Needs focus"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="icon-button edit-action"
                              title="Edit student"
                              aria-label={`Edit ${student.name}`}
                              onClick={() => openEditForm(student)}
                            >
                              ✎
                            </button>
                            <button
                              className="icon-button delete-action"
                              title="Delete student"
                              aria-label={`Delete ${student.name}`}
                              onClick={() => deleteStudent(student)}
                            >
                              ♲
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">⌕</div>
                  <h3>No students found</h3>
                  <p>Try another search or add a new student.</p>
                  <button className="primary-button" onClick={openAddForm}>
                    ＋ Add Student
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="table-footer">
            <span>
              Showing <strong>{filteredStudents.length}</strong> of{" "}
              <strong>{students.length}</strong> students
            </span>
            <span className="footer-note">
              <span className="status-dot" /> Synced with your database
            </span>
          </div>
        </section>

        <footer className="page-footer">
          <span>© 2026 Studora · Student Management</span>
          <span>Built with React + Spring Boot + PostgreSQL ✦</span>
        </footer>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <section
            className="student-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
          >
            <div className="modal-heading">
              <div>
                <span className="modal-eyebrow">STUDENT RECORD</span>
                <h2 id="form-title">
                  {editingId !== null ? "Edit Student" : "Add New Student"}
                </h2>
                <p>
                  {editingId !== null
                    ? "Update the student's information below."
                    : "Fill in the details to register a new student."}
                </p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form className="student-form" onSubmit={handleSubmit}>
              <label>
                Full Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Kumar"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Email Address
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  maxLength={150}
                  required
                />
              </label>

              <label>
                Department
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. CSE"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Marks <span className="label-hint">(out of 100)</span>
                <input
                  name="marks"
                  type="number"
                  value={form.marks}
                  onChange={handleChange}
                  placeholder="e.g. 88"
                  min="0"
                  max="100"
                  step="any"
                  required
                />
              </label>

              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save Changes"
                      : "＋ Add Student"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
