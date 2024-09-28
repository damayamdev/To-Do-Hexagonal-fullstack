import { TodoPort } from '../ports/todo.port';
import { Todo } from '../../domain/entities/todo.entity';
import { TodoStatus } from '../../domain/value-objects/todo-status.vo';

export class TodoUseCase {
  constructor(private todoPort: TodoPort) {}

  async createTodo(userId: string, title: string, description: string): Promise<Todo> {
    return this.todoPort.createTodo(userId, title, description);
  }

  async updateTodo(id: string, userId: string, title?: string, description?: string, status?: TodoStatus): Promise<Todo> {
    return this.todoPort.updateTodo(id, userId, title, description, status);
  }

  async deleteTodo(id: string, userId: string): Promise<void> {
    return this.todoPort.deleteTodo(id, userId);
  }

  async listTodos(userId: string): Promise<Todo[]> {
    return this.todoPort.listTodos(userId);
  }

  async markTodoStatus(id: string, userId: string, status: TodoStatus): Promise<Todo> {
    return this.todoPort.markTodoStatus(id, userId, status);
  }
}