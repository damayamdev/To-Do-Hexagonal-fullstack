import { Todo } from '../../domain/entities/todo.entity';
import { TodoStatus } from '../../domain/value-objects/todo-status.vo';

export interface TodoPort {
  createTodo(title: string, description: string): Promise<Todo>;
  updateTodo(id: string, title: string, description: string): Promise<Todo>;
  deleteTodo(id: string): Promise<void>;
  listTodos(): Promise<Todo[]>;
  markTodoStatus(id: string, status: TodoStatus): Promise<Todo>;
}