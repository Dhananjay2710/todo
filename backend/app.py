from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

TODO_FILE = 'todos.json'

def load_todos():
    if not os.path.exists(TODO_FILE):
        with open(TODO_FILE, 'w') as f:
            json.dump([], f)
    with open(TODO_FILE, 'r') as f:
        return json.load(f)

def save_todos(todos):
    with open(TODO_FILE, 'w') as f:
        json.dump(todos, f, indent=4)

@app.route('/api/todos', methods=['GET'])
def get_todos():
    todos = load_todos()
    return jsonify(todos), 200

@app.route('/api/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    if not data or not 'task' in data:
        return jsonify({'error': 'Invalid input'}), 400

    todos = load_todos()
    new_todo = {
        'id': len(todos) + 1,
        'task': data['task'],
        'completed': False
    }
    todos.append(new_todo)
    save_todos(todos)
    return jsonify(new_todo), 201

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    todos = load_todos()
    todos = [todo for todo in todos if todo['id'] != todo_id]
    save_todos(todos)
    return jsonify({'result': True}), 200

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid input'}), 400

    todos = load_todos()
    for todo in todos:
        if todo['id'] == todo_id:
            todo['task'] = data.get('task', todo['task'])
            todo['completed'] = data.get('completed', todo['completed'])
            break
    else:
        return jsonify({'error': 'Todo not found'}), 404

    save_todos(todos)
    return jsonify(todo), 200

if __name__ == '__main__':
    app.run( host = '0.0.0.0' , port = 80)
