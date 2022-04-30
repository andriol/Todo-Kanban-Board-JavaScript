import View from './views.js';
import TodoApi from './TodoAPI.js';
export default class App {
  constructor(root) {
    this.root = root;
    this.todos = [];
    this.todo = {};
    this.view = new View(root, this._handlers());
    this._renderTodos();
  }
  _renderTodos() {
    const todos = TodoApi.getTodos();
    this._addTodos(todos);
    window.addEventListener('DOMContentLoaded', this.view.KanbanTodos());
  }
  _addTodos(todos) {
    console.log(todos);
    this.todos = todos;
    this.view.updateTodoList(todos);
  }
  _activeItem(todo) {
    console.log(todo);
    this.todo = todo;
  }

  _handlers() {
    return {
      activeTodo: (todoItem) => {
        const todo = this.todos.find((todo) => todo.id == todoItem);
        this._activeItem(todo);
      },
      addTodo: (todo) => {
        const todos = {
          text: todo,
        };

        TodoApi.postTodos(todos);
        this._renderTodos();
      },
      deleteTodo: (id) => {
        TodoApi.deleteTodos(id);
        this._renderTodos();
      },
      editTodo: (text) => {
        const todo = {
          id: this.todo.id,
          text,
        };
        TodoApi.postTodos(todo);
        this._renderTodos();
      },
    };
  }
}
