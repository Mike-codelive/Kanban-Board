export default class App {
  static getTasks(columnId) {
    const data = read().find((column) => {
      return column.columnId == columnId;
    });

    if (!data) {
      return [];
    }

    return data.tasks;
  }

  static insertTask(columnId, content, color) {
    const data = read();
    const column = data.find((column) => {
      return column.columnId == columnId;
    });
    if (color === undefined) {
      color = "green";
    }

    const task = {
      taskId: Math.floor(Math.random() * 100000),
      content: content,
      color: color,
      date: getDate(),
    };
    console.log(task);

    column.tasks.push(task);
    save(data);
    return task;
  }

  static updateTask(taskId, updatedInformation) {
    const data = read();

    function findColumnTask() {
      for (const column of data) {
        const task = column.tasks.find((item) => {
          return item.taskId == taskId;
        });

        if (task) {
          return [task, column];
        }
      }
    }
    const [task, currentColumn] = findColumnTask();

    const targetColumn = data.find((column) => {
      return column.columnId == updatedInformation.columnId;
    });

    task.content = updatedInformation.content;
    currentColumn.tasks.splice(currentColumn.tasks.indexOf(task), 1);
    targetColumn.tasks.push(task);

    save(data);
  }

  static deleteTask(taskId) {
    const data = read();

    for (const column of data) {
      const task = column.tasks.find((item) => {
        return item.taskId == taskId;
      });

      column.tasks.splice(column.tasks.indexOf(task), 1);
    }

    save(data);
  }

  static getAllTasks() {
    const data = read();
    columnCount();
    return [data[0].tasks, data[1].tasks, data[2].tasks];
  }
}

const read = () => {
  const data = localStorage.getItem("data");

  if (!data) {
    return [
      { columnId: 0, tasks: [] },
      { columnId: 1, tasks: [] },
      { columnId: 2, tasks: [] },
    ];
  }

  return JSON.parse(data);
};

const save = (data) => {
  localStorage.setItem("data", JSON.stringify(data));
  columnCount();
};

const getDate = () => {
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();

  return `${day}/${month}/${year}`;
};

const columnCount = () => {
  const data = read();

  const todo = document.querySelector("span.todo");
  todo.textContent = data[0].tasks.length;

  const pending = document.querySelector("span.pending");
  pending.textContent = data[1].tasks.length;

  const completed = document.querySelector("span.completed");
  completed.textContent = data[2].tasks.length;
};
