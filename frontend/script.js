const API_URL = 'http://127.0.0.1:5000/api/todos';

document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    // Fetch and display todos on page load
    fetchTodos();

    // Handle form submission
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = todoInput.value.trim();
        if (task) {
            addTodo(task);
            todoInput.value = '';
        }
    });

    // Function to fetch todos from the server
    function fetchTodos() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                todoList.innerHTML = '';
                data.forEach(todo => {
                    displayTodo(todo);
                });
            })
            .catch(error => console.error('Error fetching todos:', error));
    }

    // Function to add a new todo
    function addTodo(task) {
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task })
        })
        .then(response => response.json())
        .then(todo => {
            displayTodo(todo);
        })
        .catch(error => console.error('Error adding todo:', error));
    }

    // Function to delete a todo
    function deleteTodo(id) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            const li = document.getElementById(`todo-${id}`);
            if (li) {
                li.remove();
            }
        })
        .catch(error => console.error('Error deleting todo:', error));
    }

    // Function to toggle completion status
    function toggleCompletion(id, completed) {
        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !completed })
        })
        .then(response => response.json())
        .then(updatedTodo => {
            const li = document.getElementById(`todo-${id}`);
            if (li) {
                if (updatedTodo.completed) {
                    li.classList.add('completed');
                } else {
                    li.classList.remove('completed');
                }
            }
        })
        .catch(error => console.error('Error updating todo:', error));
    }

    // Function to display a single todo in the DOM
    function displayTodo(todo) {
        const li = document.createElement('li');
        li.id = `todo-${todo.id}`;
        if (todo.completed) {
            li.classList.add('completed');
        }

        const taskSpan = document.createElement('span');
        taskSpan.className = 'task';
        taskSpan.textContent = todo.task;
        taskSpan.style.cursor = 'pointer';
        taskSpan.addEventListener('click', () => {
            toggleCompletion(todo.id, todo.completed);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            deleteTodo(todo.id);
        });

        li.appendChild(taskSpan);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }
});
