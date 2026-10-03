class TaskManager {
  constructor() {
    this.counter = 0;
    this.input = document.getElementById("taskInput");
    this.addBtn = document.getElementById("addTaskBtn");
    this.loadBtn = document.getElementById("loadSamplesBtn");
    this.list = document.getElementById("taskList");
    this.message = document.getElementById("taskMessage");
    this.totalEl = document.getElementById("totalCount");
    this.pendingEl = document.getElementById("pendingCount");
    this.completedEl = document.getElementById("completedCount");

    this.addBtn.addEventListener("click", () => this.addTask(this.input.value));
    this.loadBtn.addEventListener("click", () => this.loadSampleTasks());
    this.list.addEventListener("click", (event) => this.handleTaskListClick(event));

    this.updateTaskCounts();
  }

  makeId() {
    this.counter += 1;
    return "task-" + this.counter;
  }

  createTaskElement(taskText, taskId) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.taskId = taskId;
    li.dataset.state = "pending";

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = taskText;

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.textContent = "Complete";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";

    li.append(span, completeBtn, editBtn, removeBtn);
    return li;
  }

  addTask(taskText) {
    const clean = taskText.trim();
    if (clean === "") {
      this.message.textContent = "Task cannot be empty";
      return;
    }

    const task = this.createTaskElement(clean, this.makeId());
    this.list.appendChild(task);

    this.input.value = "";
    this.message.textContent = "";
    this.updateTaskCounts();
  }

  toggleTaskComplete(taskItem) {
    const done = taskItem.classList.toggle("completed");
    taskItem.dataset.state = done ? "completed" : "pending";
    this.updateTaskCounts();
  }

  beginTaskEdit(taskItem) {
    const span = taskItem.querySelector(".task-text");
    const editBtn = taskItem.querySelector(".edit-btn");

    const input = document.createElement("input");
    input.className = "edit-input";
    input.value = span.textContent;

    taskItem.replaceChild(input, span);
    editBtn.textContent = "Save";
  }

  saveTaskEdit(taskItem) {
    const input = taskItem.querySelector(".edit-input");
    const editBtn = taskItem.querySelector(".edit-btn");

    const clean = input.value.trim();
    if (clean === "") {
      this.message.textContent = "Task cannot be empty";
      return;
    }

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = clean;

    taskItem.replaceChild(span, input);
    editBtn.textContent = "Edit";
    this.message.textContent = "";
  }

  removeTask(taskItem) {
    taskItem.remove();
    this.updateTaskCounts();
  }

  updateTaskCounts() {
    const items = this.list.querySelectorAll(".task-item");
    let completed = 0;

    items.forEach((item) => {
      if (item.dataset.state === "completed") {
        completed += 1;
      }
    });

    const total = items.length;
    this.totalEl.textContent = total;
    this.completedEl.textContent = completed;
    this.pendingEl.textContent = total - completed;
  }

  handleTaskListClick(event) {
    const button = event.target;
    const taskItem = button.closest(".task-item");
    if (!taskItem) {
      return;
    }

    if (button.classList.contains("complete-btn")) {
      this.toggleTaskComplete(taskItem);
    } else if (button.classList.contains("edit-btn")) {
      if (button.textContent === "Edit") {
        this.beginTaskEdit(taskItem);
      } else {
        this.saveTaskEdit(taskItem);
      }
    } else if (button.classList.contains("remove-btn")) {
      this.removeTask(taskItem);
    }
  }

  loadSampleTasks() {
    const samples = ["Review DOM selectors", "Practice createElement", "Study event delegation"];
    const fragment = document.createDocumentFragment();

    samples.forEach((text) => {
      fragment.appendChild(this.createTaskElement(text, this.makeId()));
    });

    this.list.appendChild(fragment);
    this.updateTaskCounts();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new TaskManager();
});
