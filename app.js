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
      position: column.tasks.length,
    };
    // console.log(task);

    column.tasks.push(task);
    this.save(data);
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

    if (!updatedInformation.content) {
      task.color = updatedInformation.color;
    }

    if (!updatedInformation.color) {
      task.content = updatedInformation.content;
    }

    const taskIndex = currentColumn.tasks.indexOf(task);
    task.position = taskIndex;

    currentColumn.tasks.splice(taskIndex, 1);
    targetColumn.tasks.push(task);

    this.save(data);
  }

  static moveTask(taskId, sourceColumnId, targetColumnId, newPosition) {
    const data = read();

    const sourceColumn = data.find((col) => col.columnId == sourceColumnId);
    const targetColumn = data.find((col) => col.columnId == targetColumnId);

    const task = sourceColumn.tasks.find((t) => t.taskId == taskId);

    const sourceTaskIndex = sourceColumn.tasks.indexOf(task);
    sourceColumn.tasks.splice(sourceTaskIndex, 1);

    task.position = newPosition;
    targetColumn.tasks.splice(newPosition, 0, task);

    this.save(data);
  }

  static deleteTask(taskId) {
    const data = read();

    for (const column of data) {
      const task = column.tasks.find((item) => {
        return item.taskId == taskId;
      });

      if (task) {
        column.tasks.splice(column.tasks.indexOf(task), 1);
      }
    }

    this.save(data);
  }
  static columnCount() {
    const data = read();

    const todo = document.querySelector("span.todo");
    todo.textContent = data[0].tasks.length;

    const pending = document.querySelector("span.pending");
    pending.textContent = data[1].tasks.length;

    const completed = document.querySelector("span.completed");
    completed.textContent = data[2].tasks.length;
  }

  static getAllTasks() {
    const data = read();
    this.columnCount();
    return [data[0].tasks, data[1].tasks, data[2].tasks];
  }

  static save(data) {
    localStorage.setItem("data", JSON.stringify(data));
    this.columnCount();
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

const getDate = () => {
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();

  return `${day}/${month}/${year}`;
};
