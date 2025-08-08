document.addEventListener("DOMContentLoaded", function () {
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const addBtn = document.getElementById("add-btn");
  const filterSelect = document.getElementById("filter-select");
  const deleteAllBtn = document.getElementById("delete-all-btn");
  const todoList = document.getElementById("todo-list");

  // Modal elements
  const modal = document.getElementById("viewModal");
  const closeModal = document.getElementById("closeModal");
  const modalTask = document.getElementById("modalTask");
  const modalDate = document.getElementById("modalDate");
  const modalStatus = document.getElementById("modalStatus");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function renderTodos(filter = "all") {
    todoList.innerHTML = "";

    let filteredTodos = todos;
    if (filter === "pending") {
      filteredTodos = todos.filter(todo => todo.status === "Pending");
    } else if (filter === "completed") {
      filteredTodos = todos.filter(todo => todo.status === "Completed");
    }

    if (filteredTodos.length === 0) {
      todoList.innerHTML = <tr><td colspan="4" class="no-task">No task found</td></tr>;
      return;
    }

    filteredTodos.forEach((todo, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${todo.task}</td>
        <td>${todo.date}</td>
        <td>${todo.status}</td>
        <td>
          <button class="action-btn done" onclick="markDone(${index})">Done</button>
          <button class="action-btn view" onclick="viewDetail(${index})">View</button>
          <button class="action-btn delete" onclick="deleteTodo(${index})">Delete</button>
        </td>
      `;
      todoList.appendChild(row);
    });
  }

  // Add new task
  addBtn.addEventListener("click", function () {
    const task = todoInput.value.trim();
    const date = dateInput.value;

    if (!task || !date) {
      alert("Please enter both task and date.");
      return;
    }

    todos.push({ task, date, status: "Pending" });
    saveTodos();
    renderTodos(filterSelect.value);
    todoInput.value = "";
    dateInput.value = "";
  });

  // Filter dropdown change
  filterSelect.addEventListener("change", function () {
    renderTodos(filterSelect.value);
  });

  // Delete all tasks
  deleteAllBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all tasks?")) {
      todos = [];
      saveTodos();
      renderTodos(filterSelect.value);
    }
  });

  // Functions for buttons
  window.deleteTodo = function (index) {
    if (confirm("Delete this task?")) {
      todos.splice(index, 1);
      saveTodos();
      renderTodos(filterSelect.value);
    }
  };

  window.markDone = function (index) {
    todos[index].status = "Completed";
    saveTodos();
    renderTodos(filterSelect.value);
  };

  window.viewDetail = function (index) {
    const todo = todos[index];
    modalTask.textContent = todo.task;
    modalDate.textContent = todo.date;
    modalStatus.textContent = todo.status;
    modal.style.display = "block";
  };

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Initial render
  renderTodos();
})