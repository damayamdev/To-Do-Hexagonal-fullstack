import React from 'react';
import { Todo } from '../../../domain/entities/todo.entity';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onToggleStatus, onDelete }) => {
  return (
    <ul className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggleStatus={() => onToggleStatus(todo._id)}
          onDelete={() => onDelete(todo._id)}
        />
      ))}
    </ul>
  );
};