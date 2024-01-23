import App from "./app.js";

// console.log("kalem on the track boy");
// console.log(App.getAllTasks());
// console.log(App.getTasks());
// console.log(App.insertTask(0, "test task whit date"));
// App.deleteTask(43416);
// console.log(
//   App.updateTask(67127, {
//     columnId: 2,
//     content: "updated task",
//   })
// );

const todo = document.querySelector(".cards.todo");
const pending = document.querySelector(".cards.pending");
const completed = document.querySelector(".cards.completed");
const taskbox = [todo, pending, completed];

function addTaskCard(task, index) {
  const element = document.createElement("form");
  element.className = "card p-relative";
  element.draggable = true;
  element.dataset.id = task.taskId;
  element.innerHTML = `
        <div
        class="post-it post-it-${task.color}"
        type="text"
        name="task"
        autocomplete="off"
        disabled="disabled"
      >
      ${task.content}
      </div>

      <div>
      <span class="post-it-date p-absolute">${task.date}</span>
      <span class="post-it-btn p-absolute">
        <button class="bi bi-pencil edit" data-id="${task.taskId}">
          <span class="tooltiptext">Edit</span>
        </button>
        <button
          class="bi bi-check-lg update hide"
          data-id="${task.taskId}"
        ></button>
        <button class="bi bi-color edit-color" data-id="${task.taskId}">
          <span class="tooltiptext">Change color</span>
        </button>
        <button class="bi bi-trash delete" data-id="${task.taskId}">
          <span class="tooltiptext">Delete</span>
        </button>
      </span>
    </div>
    `;
  taskbox[index].appendChild(element);
}

App.getAllTasks().forEach((tasks, index) => {
  tasks.forEach((task) => {
    addTaskCard(task, index);
  });
});

const addForm = document.querySelectorAll(".add");

addForm.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.task.value) {
      const task = App.insertTask(
        form.submit.dataset.id,
        form.task.value.trim()
      );
      console.log(form.colors.value);
      addTaskCard(task, form.submit.dataset.id);
      form.reset();
    }
  });
});

const colorPicker = document.querySelector(".color-select");

colorPicker.addEventListener("click", (e) => {
  const children = colorPicker.children[0];
  children.classList.toggle("hide");

  if (e.target.type === "radio") {
    e.target.parentElement.parentElement.parentElement.className = "";
    e.target.parentElement.parentElement.parentElement.className =
      "color-select p-relative";
    const color = e.target.className;
    e.target.parentElement.parentElement.parentElement.classList.add(color);
  }
});
