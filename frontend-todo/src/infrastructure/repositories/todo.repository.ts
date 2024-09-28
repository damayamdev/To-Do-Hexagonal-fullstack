import { TodoPort } from '../../application/ports/todo.port';
import { Todo } from '../../domain/entities/todo.entity';
import { TodoStatus } from '../../domain/value-objects/todo-status.vo';
import { api } from '../adapters/api.adapter';

export class TodoRepository implements TodoPort {
  async createTodo(title: string, description: string): Promise<Todo> {
    const { data } = await api.post('/todos', { title, description });
    return data;
  }

  async updateTodo(id: string, title: string, description: string): Promise<Todo> {
    const { data } = await api.put(`/todos/${id}`, { title, description });
    return data;
  }

  async deleteTodo(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  }

  async listTodos(): Promise<Todo[]> {
    const { data } = await api.get('/todos');
    return data;
  }

  async markTodoStatus(id: string, status: TodoStatus): Promise<Todo> {

    const { data } = await api.patch(`/todos/${id}/status`, { status });
    return data;
  }
}