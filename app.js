const taskInput = document.getElementById("task-input");
const deadlineInput = document.getElementById("deadline-input");
const addBtn = document.getElementById("add-btn");
const clearAllBtn = document.getElementById("clear-all-btn");
const taskList = document.getElementById("task-list");

let tasks = [];

// Tải từ server
async function fetchTasks() {
  const res = await fetch("http://localhost:3000/api/tasks");
  tasks = await res.json();
  renderTasks();
}

// Thêm công việc
async function addTask() {
  const text = taskInput.value.trim();
  const deadline = deadlineInput.value;
  if (!text) return;

  const res = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, deadline }),
  });

  const newTask = await res.json();
  tasks.push(newTask);
  renderTasks();

  taskInput.value = "";
  deadlineInput.value = "";
  taskInput.focus();
}

// Xoá công việc
async function deleteTask(id) {
  await fetch(`http://localhost:3000/api/tasks/${id}`, { method: "DELETE" });
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

// Sửa công việc
async function editTask(id, newText) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.text = newText;

  await fetch(`http://localhost:3000/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: newText }),
  });
}

// Xoá tất cả
async function clearAllTasks() {
  await fetch("http://localhost:3000/api/tasks", { method: "DELETE" });
  tasks = [];
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "bg-white p-4 rounded shadow flex justify-between items-start gap-4";

    const left = document.createElement("div");

    const taskText = document.createElement("div");
    taskText.contentEditable = true;
    taskText.textContent = task.text;
    taskText.className = "font-medium text-gray-800 editable-task";
    taskText.onblur = () => {
      const newText = taskText.textContent.trim();
      if (newText !== task.text) {
        task.text = newText;
        editTask(task.id, newText);
      }
    };

    const deadline = document.createElement("div");
    deadline.className = "text-sm text-gray-500";
    deadline.textContent = task.deadline ? `🕒 ${new Date(task.deadline).toLocaleString()}` : "";

    left.appendChild(taskText);
    if (task.deadline) left.appendChild(deadline);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.className = "text-red-500 hover:text-red-700 font-bold";
    deleteBtn.onclick = () => deleteTask(task.id);

    li.appendChild(left);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

addBtn.onclick = addTask;

clearAllBtn.onclick = () => {
  if (confirm("Xoá tất cả công việc?")) clearAllTasks();
};

[taskInput, deadlineInput].forEach(input => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addBtn.click();
  });
});

// Tự động tải công việc khi load trang
fetchTasks();
