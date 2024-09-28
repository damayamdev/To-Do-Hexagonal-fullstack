import { TodoPort } from '../ports/todo.port';
import { Todo } from '../../domain/entities/todo.entity';
import { TodoStatus } from '../../domain/value-objects/todo-status.vo';

export class TodoUseCase {
  constructor(private todoPort: TodoPort) {}

  async createTodo(title: string, description: string): Promise<Todo> {
    return this.todoPort.createTodo(title, description);
  }

  async updateTodo(id: string, title: string, description: string): Promise<Todo> {
    return this.todoPort.updateTodo(id, title, description);
  }

  async deleteTodo(id: string): Promise<void> {
    if (!id) {
      throw new Error('Todo ID is required for deletion');
    }
    return this.todoPort.deleteTodo(id);
  }

  async listTodos(): Promise<Todo[]> {
    return this.todoPort.listTodos();
  }

  async markTodoStatus(id: string, status: TodoStatus): Promise<Todo> {
    if (!id) {
      throw new Error('Todo ID is required for status update');
    }
    return this.todoPort.markTodoStatus(id, status);
  }
}