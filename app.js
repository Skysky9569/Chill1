let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("task-input");
const deadlineInput = document.getElementById("deadline-input");
const addBtn = document.getElementById("add-btn");
const clearAllBtn = document.getElementById("clear-all-btn");
const taskList = document.getElementById("task-list");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "bg-white p-4 rounded shadow flex justify-between items-start gap-4";

    const left = document.createElement("div");

    const taskText = document.createElement("div");
    taskText.contentEditable = true;
    taskText.textContent = task.text;
    taskText.className = "font-medium text-gray-800 editable-task";
    taskText.onblur = () => {
      tasks[index].text = taskText.textContent.trim();
      saveTasks();
    };

    const deadline = document.createElement("div");
    deadline.className = "text-sm text-gray-500";
    deadline.textContent = task.deadline ? `🕒 ${new Date(task.deadline).toLocaleString()}` : "";

    left.appendChild(taskText);
    if (task.deadline) left.appendChild(deadline);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.className = "text-red-500 hover:text-red-700 font-bold";
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    li.appendChild(left);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

addBtn.onclick = () => {
  const text = taskInput.value.trim();
  const deadline = deadlineInput.value;
  if (!text) return;

  tasks.push({ text, deadline });
  saveTasks();
  renderTasks();

  taskInput.value = "";
  deadlineInput.value = "";
  taskInput.focus();
};

clearAllBtn.onclick = () => {
  if (confirm("Xoá tất cả công việc?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
};

[taskInput, deadlineInput].forEach(input => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addBtn.click();
  });
});

// Khởi động khi tải trang
renderTasks();
