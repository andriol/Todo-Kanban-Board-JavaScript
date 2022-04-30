export default class Views {
  constructor(root, { addTodo, deleteTodo, editTodo, activeTodo } = {}) {
    this.root = root;
    this.addTodo = addTodo;
    this.deleteTodo = deleteTodo;
    this.activeTodo = activeTodo;
    this.editTodo = editTodo;
    this.editMode = false;
    this.root.innerHTML = `
     <h1>To-Do List <i class="fa fa-plus"></i></h1>
      <input type="text" id="text" autocomplete="off" placeholder="Add New Todo" />
       <ul class="todo__list">
       </ul>
    </div>
    `;
    const plusBtn = this.root.querySelector('.fa-plus');

    const inpValue = this.root.querySelector('#text');
    plusBtn.addEventListener('click', () => {
      plusBtn.classList.add('add');
      if (plusBtn.classList.contains('add') && !this.editMode) {
        this.addTodo(inpValue.value);
      } else if (plusBtn.classList.contains('edit') && this.editMode) {
        this.editTodo(inpValue.value);
        console.log(inpValue.value);
        plusBtn.classList.remove('edit');
        this.editMode = false;
      }
      inpValue.value = '';
    });
  }

  _createTodoListHTML(id, text, date) {
    return `
   <div class="todo__container" data-todo-id="${id}">
    <li class="todo__list-item"><span><i class='fa fa-trash delete'></i></span><span><i class='fa fa-pencil edit'></i></span>${text}</li>
     <div class="todo__list-date">${date.toLocaleString(undefined, {
       dateStyle: 'full',
       timeStyle: 'short',
     })}
    </div> 
  </div>
  
`;
  }
  updateTodoList(todos) {
    const todoList = this.root.querySelector('.todo__list');

    todoList.innerHTML = '';
    for (const todo of todos) {
      console.log(todo);
      const html = this._createTodoListHTML(
        todo.id,
        todo.text,
        new Date(todo.date)
      );

      todoList.insertAdjacentHTML('beforeend', html);
    }
    todoList.querySelectorAll('.todo__container').forEach((todoItem) => {
      const deleteBtn = todoItem.children[0].children[0];
      deleteBtn.addEventListener('click', () => {
        this.deleteTodo(todoItem.dataset.todoId);
      });
      const inpValue = this.root.querySelector('#text');
      const plusBtn = this.root.querySelector('.fa-plus');
      const editBtn = todoItem.children[0].children[1];
      const inputValue = todoItem.children[0].childNodes[2];

      editBtn.addEventListener('click', () => {
        inpValue.value = inputValue.data;
        this.editMode = true;
        this.activeTodo(todoItem.dataset.todoId);
        plusBtn.classList.remove('add');
        plusBtn.classList.add('edit');
      });
    });
  }

  _createKanbanTodoListHTML(id, text, date) {
    return `
   <li class="todo__container-kanban" data-todo-id="${id}" draggable="true" >
    <div class="todo__list-kanban" >${text}</div>
     <div class="todo__date-kanban">${date.toLocaleString(undefined, {
       dateStyle: 'medium',
     })}
    </div> 
  </li>
    `;
  }

  dragAndDrop() {
    const draggable = document.querySelectorAll('.todo__container-kanban');
    const draggableList = document.querySelectorAll('ol');
    draggable.forEach((todo) => {
      todo.addEventListener('dragstart', this._dragStart);
    });
    draggableList.forEach((todo) => {
      todo.addEventListener('dragover', this._dragOver);
      todo.addEventListener('drop', this._dragDrop);
    });
  }

  _dragStart(e) {
    const container = e.path[1].id;
    const data = e.currentTarget.closest('li').getAttribute('data-todo-id');
    e.dataTransfer.setData('text', data);
    const array = JSON.parse(localStorage.getItem(`${container}`), '[]');
    const todos = array.filter((todo) => todo.id != data);
    localStorage.setItem(`${container}`, JSON.stringify(todos));
  }
  _dragOver(e) {
    e.preventDefault();
  }

  _dragDrop(e) {
    e.preventDefault();
    const draggable = document.querySelectorAll('.todo__container-kanban');
    const container = e.currentTarget.children[1];

    draggable.forEach((todo) => {
      const id = e.dataTransfer.getData('text');
      if (todo.dataset.todoId === id) {
        const obj = {
          text: todo.children[0].innerHTML,
          id: Number(id),
          date: todo.children[1].innerHTML,
        };
        container.appendChild(todo);
        this.array = JSON.parse(
          localStorage.getItem(`${container.id}`) || '[]'
        );

        this.array.push(obj);
        localStorage.setItem(`${container.id}`, JSON.stringify(this.array));

        const filtered = this.array.filter((todo) => todo.id !== id);
        localStorage.setItem(`${container.id}`, JSON.stringify(filtered));
      }
    });
  }
  KanbanTodos() {
    const listContainer = document.querySelectorAll('ul');

    listContainer.forEach((list) => {
      const data = JSON.parse(localStorage.getItem(`${list.id}`) || '[]');
      const orderList = document.getElementById(`${list.id}`);

      if (orderList !== null) {
        orderList.innerHTML = '';
      }

      for (const todo of data) {
        console.log(todo);
        const html = this._createKanbanTodoListHTML(
          todo.id,
          todo.text,
          new Date(todo.date)
        );
        orderList.insertAdjacentHTML('beforeend', html);
      }
    });
    this.dragAndDrop();
  }
}
