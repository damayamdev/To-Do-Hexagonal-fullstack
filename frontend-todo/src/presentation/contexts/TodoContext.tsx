import React, { createContext, useContext } from 'react';
import { TodoUseCase } from '../../application/use-cases/todo.use-case';
import { TodoRepository } from '../../infrastructure/repositories/todo.repository';

const TodoContext = createContext<TodoUseCase | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const todoRepository = new TodoRepository();
  const todoUseCase = new TodoUseCase(todoRepository);

  return (
    <TodoContext.Provider value={todoUseCase}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoUseCase => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};