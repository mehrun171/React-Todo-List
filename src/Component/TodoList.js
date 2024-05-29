import React, { useState, useEffect } from 'react';
import './style.css';
import todoImage from '../image/todo.png';
import { v4 as uuidv4 } from 'uuid';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTask = async () => {
    if (inputValue.trim() === '') {
      return;
    }

    const newTask = {
      id: uuidv4(),
      title: inputValue,
      completed: false
    };

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const addedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, { ...addedTask, id: uuidv4() }]);
      setInputValue('');
    } catch (error) {
      console.log('Error adding task:', error);
    }
  };

  const handleTaskCheckboxChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleCompleteAll = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: true }))
    );
  };

  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  return (
    <div className="background-image">
      <div className="container">
        <div className="todo-app">
          <h2>
            <img src={todoImage} alt="todo-image" /> Todo List
          </h2>
          <div className="row">
            <i className="fas fa-list-check"></i>
            <input
              type="text"
              className="add-task"
              id="add"
              placeholder="Add your todo"
              autoFocus
              value={inputValue}
              onChange={handleInputChange}
            />
            <button id="btn" onClick={handleAddTask}>
              Add
            </button>
          </div>

          <div className="mid">
            <i className="fas fa-check-double"></i>
            <p id="complete-all" onClick={handleCompleteAll}>
              Complete all tasks
            </p>
            <p id="clear-all" onClick={handleClearCompleted}>
              Delete comp tasks
            </p>
          </div>

          <ul id="list">
            {tasks.map((task) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  id={`task-${task.id}`}
                  data-id={task.id}
                  className="custom-checkbox"
                  checked={task.completed}
                  onChange={() => handleTaskCheckboxChange(task.id)}
                />
                <label htmlFor={`task-${task.id}`}>{task.title}</label>
                <div>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"
                    className="delete"
                    data-id={task.id}
                    onClick={() => handleDeleteTask(task.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
