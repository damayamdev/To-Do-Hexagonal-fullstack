import React from 'react';
import { Todo } from '../../../domain/entities/todo.entity';
import { TodoStatus } from '../../../domain/value-objects/todo-status.vo';

interface TodoItemProps {
  todo: Todo;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}


export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleStatus, onDelete }) => {


  return (
    <li className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
      <div>
        <h3 className={`text-lg font-semibold ${todo.status === TodoStatus.COMPLETED ? 'line-through' : ''}`}>
          {todo.title} 
        </h3>
        <p className="text-gray-600">{todo.description}</p>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => onToggleStatus(todo._id)}
          className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          {todo.status === TodoStatus.COMPLETED ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        
        <button
          onClick={() => onDelete(todo._id)}
          className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </li>
  );
};