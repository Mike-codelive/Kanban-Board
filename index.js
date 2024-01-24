import App from "./app.js";

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
  <div class="post-it-text p-relative">
  <textarea
    class="post-it post-it-${task.color}"
    type="text"
    name="task"
    autocomplete="off"
    disabled="disabled"
    maxlength="100"
  >${task.content}</textarea>
  <span class="post-it-pag"></span>
</div>

    <div>
    <span class="post-it-date p-absolute">${task.date}</span>
    <span
      class="post-it-btn d-flex space-between gap-2 p-absolute"
    >
      <div class="bi p-relative">
        <button class="bi bi-pencil edit" data-id="${task.taskId}"></button>
        <span class="tooltiptext">Edit</span>
      </div>
      <div class="bi p-relative hide">
      <button
        class="bi bi-check-lg update"
        data-id="${task.taskId}"
        data-column="${index}"
      ></button>
      <span class="tooltiptext">Save</span>
    </div>
      <div class="bi p-relative">
        <div class="color-select p-relative">
          <div data-column='${index}' class="colors-rad hide d-flex p-absolute">
            <label>
              <input
                type="radio"
                class="post-it-green"
                name="colors"
                value="green"
                data-id="${task.taskId}"
              />
            </label>
            <label>
              <input
                type="radio"
                class="post-it-blue"
                name="colors"
                value="blue"
                data-id="${task.taskId}"
              />
            </label>
            <label>
              <input
                type="radio"
                class="post-it-orange"
                name="colors"
                value="orange"
                data-id="${task.taskId}"
              />
            </label>
            <label>
              <input
                type="radio"
                class="post-it-purple"
                name="colors"
                value="purple"
                data-id="${task.taskId}"
              />
            </label>
          </div>
        </div>
        <span class="tooltiptext">Change color</span>
      </div>
      <div class="bi p-relative">
        <button class="bi bi-trash delete" data-id="${task.taskId}"></button>
        <span class="tooltiptext">Delete</span>
      </div>
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

taskbox.forEach((column) => {
  column.addEventListener("click", (e) => {
    e.preventDefault();

    if (e.target.classList.contains("edit")) {
      e.target.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.removeAttribute(
        "disabled"
      );
      e.target.parentElement.classList.add("hide");
      e.target.parentElement.nextElementSibling.classList.remove("hide");
    }

    if (e.target.classList.contains("update")) {
      e.target.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.setAttribute(
        "disabled",
        "disabled"
      );
      e.target.parentElement.classList.add("hide");
      e.target.parentElement.previousElementSibling.classList.remove("hide");

      const taskId = e.target.dataset.id;
      const columnId = e.target.dataset.column;
      const content =
        e.target.parentElement.parentElement.parentElement
          .previousElementSibling.firstElementChild.value;
      App.updateTask(taskId, {
        columnId: columnId,
        content: content,
      });
    }
  });
});

const addForm = document.querySelectorAll(".add");

addForm.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (form.task.value) {
      const task = App.insertTask(
        form.submit.dataset.id,
        form.task.value.trim(),
        form.colors.value
      );
      // console.log(form.colors.value);
      addTaskCard(task, form.submit.dataset.id);
      addClickEventToColorPicker();
      form.reset();
    }
  });
});

const resetAllColorPicker = () => {
  const colorPicker = document.querySelectorAll(".color-select");
  colorPicker.forEach((picker) => {
    const childNode = picker.children[0];
    childNode.classList.add("hide");
  });
};

const addClickEventToColorPicker = () => {
  const colorPicker = document.querySelectorAll(".color-select");
  colorPicker.forEach((picker) => {
    picker.addEventListener("click", (e) => {
      const children = picker.children[0];
      resetAllColorPicker();
      children.classList.toggle("hide");

      if (e.target.type === "radio") {
        e.target.parentElement.parentElement.parentElement.className = "";
        e.target.parentElement.parentElement.parentElement.className =
          "color-select p-relative";
        const color = e.target.className;
        const colorValue = e.target.value;
        const taskId = e.target.dataset.id;
        const columnId = e.target.parentElement.parentElement.dataset.column;
        console.log(columnId, colorValue);
        e.target.parentElement.parentElement.parentElement.classList.add(color);

        if (
          e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.classList.contains(
            "post-it"
          )
        ) {
          console.log(
            (e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.className =
              "")
          );
          e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.className = `post-it ${color}`;

          App.updateTask(taskId, {
            columnId: columnId,
            color: colorValue,
          });
        }
      }
    });
  });
};

document.addEventListener("click", (e) => {
  const colorPicker = document.querySelectorAll(".color-select");
  const isColorPicker = Array.from(colorPicker).some((picker) =>
    picker.contains(e.target)
  );
  if (!isColorPicker) {
    resetAllColorPicker();
  }
});

addClickEventToColorPicker();
