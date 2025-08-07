// server.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

const DATA_FILE = "tasks.json";
const TEXT_FILE = "tasks.txt";

app.use(cors());
app.use(express.json());

// Load tasks
function loadTasks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Save tasks to JSON and TXT
function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));

  const textData = tasks.map(t => `- ${t.text}${t.deadline ? ` (🕒 ${new Date(t.deadline).toLocaleString()})` : ""}`).join("\n");
  fs.writeFileSync(TEXT_FILE, textData);
}

// GET all tasks
app.get("/api/tasks", (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// POST new task
app.post("/api/tasks", (req, res) => {
  const { text, deadline } = req.body;
  if (!text) return res.status(400).json({ error: "Task text is required" });

  const tasks = loadTasks();
  const newTask = { id: Date.now(), text, deadline };
  tasks.push(newTask);
  saveTasks(tasks);

  res.status(201).json(newTask);
});

// PUT edit task
app.put("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { text, deadline } = req.body;
  let tasks = loadTasks();
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) return res.status(404).json({ error: "Task not found" });

  tasks[index].text = text ?? tasks[index].text;
  tasks[index].deadline = deadline ?? tasks[index].deadline;
  saveTasks(tasks);

  res.json(tasks[index]);
});

// DELETE task
app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let tasks = loadTasks();
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
  res.json({ message: "Deleted" });
});

// DELETE all
app.delete("/api/tasks", (req, res) => {
  saveTasks([]);
  res.json({ message: "All tasks cleared" });
});

app.listen(PORT, () => console.log(`📡 Server running on http://localhost:${PORT}`));
