import React, { useEffect, useState } from 'react';
import { TodoForm } from '../components/Todo/TodoForm';
import { TodoList } from '../components/Todo/TodoList';
import { useTodo } from '../contexts/TodoContext';
import { useAuth } from '../contexts/AuthContext';
import { Todo } from '../../domain/entities/todo.entity';
import { TodoStatus } from '../../domain/value-objects/todo-status.vo';

export const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const todoUseCase = useTodo();
  const { user, logout } = useAuth();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const fetchedTodos = await todoUseCase.listTodos();
      setTodos(fetchedTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const handleCreateTodo = async (title: string, description: string) => {
    try {
      await todoUseCase.createTodo(title, description);
      loadTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const todo = todos.find((t) => t._id === id);
      if (todo) {
        const newStatus = todo.status === TodoStatus.COMPLETED ? TodoStatus.PENDING : TodoStatus.COMPLETED;
        await todoUseCase.markTodoStatus(id, newStatus);
        loadTodos();
      }
    } catch (error) {
      console.error('Error toggling todo status:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoUseCase.deleteTodo(id);
      loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Todo List</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{user?.email}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
            <TodoForm onSubmit={handleCreateTodo} />
            <div className="mt-8">
              <TodoList todos={todos} onToggleStatus={handleToggleStatus} onDelete={handleDeleteTodo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};