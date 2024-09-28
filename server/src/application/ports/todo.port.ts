import { Todo } from '../../domain/entities/todo.entity';
import { TodoStatus } from '../../domain/value-objects/todo-status.vo';

export interface TodoPort {
  createTodo(userId: string, title: string, description: string): Promise<Todo>;
  updateTodo(id: string, userId: string, title?: string, description?: string, status?: TodoStatus): Promise<Todo>;
  deleteTodo(id: string, userId: string): Promise<void>;
  listTodos(userId: string): Promise<Todo[]>;
  markTodoStatus(id: string, userId: string, status: TodoStatus): Promise<Todo>;
}