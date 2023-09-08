const selector = document.querySelectorAll('.selector');
const taskInput = document.querySelector('#input__text');
const add = document.querySelector('.add');
const lists = document.querySelector('.lists');
const main = document.querySelector('.tasks');
const head = document.querySelector('.head');
const clear = document.querySelector('.clear');
const itemsLeft = document.querySelector('.items__left');
const mode = document.querySelector('.mode');
const body = document.querySelector('body');

class Task {
  id = (Date.now() + '').slice(-10);
  constructor(todo) {
    this.todo = todo.replace(todo[0], todo[0].toUpperCase());
    this.completed = false; // Add a property to track completion status
    this.id;
  }
}

class App {
  #tasks = []; // Use a single array to store tasks
  newTasks;
  constructor() {
    this.#tasks = JSON.parse(localStorage.getItem('todoList')) || [];
    add.addEventListener('click', this.newTask.bind(this));
    lists.addEventListener('change', this.#handleCheckboxChange.bind(this)); // Listen for checkbox changes
    clear.addEventListener('click', this.#clearCompletedTasks.bind(this));
    this.#renderTasks(); // Initial render
    this.#tasksLeft();
    // Add this inside your App class constructor
    selector.forEach((select) => {
      select.addEventListener('click', () =>
        this.#filterTasks(select.textContent)
      );
    });
    mode.addEventListener('click', this.changeMode);

    this.#filterTasks('All');
  }

  changeMode() {
    mode.getAttribute('src') === '../images/sun.svg'
      ? (mode.src = '../images/moon.svg')
      : (mode.src = '../images/sun.svg');
    body.classList.toggle('lightmode');
  }

  newTask() {
    const newTaskText = taskInput.value.trim();
    if (!newTaskText) return alert('Add Task');

    this.newTasks = new Task(newTaskText);

    this.#tasks.push(this.newTasks);
    taskInput.value = '';
    taskInput.blur();
    this.#renderTasks();
    this.#filterTasks('All');
    this.#saveTasks();
    this.#tasksLeft();
  }

  #handleCheckboxChange(event) {
    if (event.target.classList.contains('input__check')) {
      const index = Array.from(lists.children).indexOf(
        event.target.closest('li')
      );
      this.#tasks[index].completed = event.target.checked;
      this.#renderTasks();
      this.#saveTasks();
      this.#tasksLeft();
    }
  }

  #saveTasks() {
    localStorage.setItem('todoList', JSON.stringify(this.#tasks));
  }

  #tasksLeft() {
    const remainingTasks = this.#tasks.filter((task) => !task.completed);
    if (remainingTasks.length === 0) {
      itemsLeft.textContent = `No active tasks`;
    }
    if (remainingTasks.length === 1) {
      itemsLeft.textContent = `1 task left`;
    }
    if (remainingTasks.length > 1) {
      itemsLeft.textContent = `${remainingTasks.length} tasks left`;
    }
  }

  #clearCompletedTasks() {
    this.#tasks = this.#tasks.filter((task) => !task.completed);

    this.#renderTasks();
    this.#saveTasks();
    this.#tasksLeft();
    this.#filterTasks('All');
    if (this.#tasks.length === 0) {
      this.#filterTasks('All');
    }
  }

  #filterTasks(filter) {
    //   Removing active class
    selector.forEach((select) => {
      select.classList.remove('active');
    });

    const checked = Array.from(selector).find(
      (select) => select.textContent === filter
    );
    if (checked) {
      checked.classList.add('active');
      head.textContent = filter;
    }
    // Filter tasks based on the button clicked
    const filteredTasks = this.#tasks.filter((task) => {
      if (filter === 'All') {
        return true; // Show all tasks
      } else if (filter === 'Active') {
        return !task.completed; // Show only active tasks
      } else if (filter === 'Completed') {
        return task.completed; // Show only completed tasks
      }
    });

    // If no active tasks and 'All' or 'Active' filter is selected, add a default task
    if (
      filteredTasks.length === 0 &&
      (filter === 'All' || filter === 'Active')
    ) {
      filteredTasks.push(new Task('No tasks added'));
    }

    if (filteredTasks.length === 0 && filter === 'Completed') {
      filteredTasks.push(new Task('No Completed tasks '));
    }

    // Render the filtered tasks
    this.#renderTasks(filteredTasks);
  }

  #renderTasks(tasks = this.#tasks) {
    lists.innerHTML = ''; // Clear existing tasks
    tasks.forEach((task) => {
      const listItem = document.createElement('li');
      listItem.classList.add('list');
      if (task.completed) {
        listItem.classList.add('completed'); // Apply completed class based on task status
      }

      listItem.innerHTML = `
      <label>
        <input id = "${task.id}" class="input__check" type="checkbox" ${
        task.completed ? 'checked' : ''
      } />
        <span class="custom-checkbox"></span>
      </label>
      <p>${task.todo}</p>
    `;

      lists.appendChild(listItem);
    });
    this.#tasksLeft();
  }
}

const app = new App();
document.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') app.newTask();
});
