
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Check that the API is running
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "TaskFlow API is running",
  });
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const [tasks] = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create a task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Task title is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO tasks (title, description) VALUES (?, ?)",
      [title.trim(), description || null]
    );

    res.status(201).json({
      id: result.insertId,
      title: title.trim(),
      description: description || null,
      status: "To Do",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create task" });
  }
});

/* Update an existing task */
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const allowedStatuses = ["To Do", "In Progress", "Completed"];

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Task title is required" });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid task status" });
    }

    const [result] = await pool.query(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?
       WHERE id = ?`,
      [
        title.trim(),
        description || null,
        status || "To Do",
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to update task" });
  }
});

/* Delete a task */

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`TaskFlow API running on port ${PORT}`);
});
