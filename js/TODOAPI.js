export default class TodoAPI {
  static getTodos() {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');

    return todos.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }
  static postTodos(updateTodos) {
    const todos = TodoAPI.getTodos();
    const todosList = JSON.parse(localStorage.getItem('To-Do') || '[]');
    const todo = todos.find((todo) => todo.id == updateTodos.id);

    if (todo) {
      todo.text = updateTodos.text;
      todo.date = new Date();
    } else {
      updateTodos.id = Math.floor(Math.random() * 1000000);
      updateTodos.date = new Date();
      todos.push(updateTodos);
      todosList.push(updateTodos);
    }
    localStorage.setItem('To-Do', JSON.stringify(todosList));
    localStorage.setItem('todos', JSON.stringify(todos));

    const listContainer = document.querySelectorAll('ul');
    kanbanStorageUpdate(listContainer, updateTodos);
  }

  static getTodo(todoItem) {
    const todos = TodoAPI.getTodos();
    const todo = todos.find((todo) => todo.id == todoItem.id);

    return todo;
  }
  static deleteTodos(id) {
    const todos = TodoAPI.getTodos();
    const listContainer = document.querySelectorAll('ul');
    kanbanStorageDelete(listContainer, id);

    const todo = todos.filter((todo) => todo.id != id);
    localStorage.setItem('todos', JSON.stringify(todo));
  }
}
function kanbanStorageDelete(container, id) {
  container.forEach((list) => {
    const data = JSON.parse(localStorage.getItem(`${list.id}`) || '[]');
    const items = data.filter((todo) => todo.id != id);
    localStorage.setItem(`${list.id}`, JSON.stringify(items));
  });
}
function kanbanStorageUpdate(container, updateTodos) {
  container.forEach((list) => {
    const data = JSON.parse(localStorage.getItem(`${list.id}`) || '[]');
    const item = data.find((todo) => todo.id == updateTodos.id);
    if (item !== undefined) {
      if (item) {
        item.text = updateTodos.text;
        item.date = new Date();
      }
      localStorage.setItem(`${list.id}`, JSON.stringify(data));
    }
  });
}
