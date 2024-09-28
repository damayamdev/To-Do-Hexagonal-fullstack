import { TodoPort } from '../../application/ports/todo.port';
import { Todo, TodoModel } from '../../domain/entities/todo.entity';
import { TodoStatus } from '../../domain/value-objects/todo-status.vo';

export class TodoRepository implements TodoPort {
  async createTodo(userId: string, title: string, description: string): Promise<Todo> {
    const todo = new TodoModel({
      userId,
      title,
      description,
    });
    await todo.save();
    return todo;
  }

  async updateTodo(id: string, userId: string, title?: string, description?: string, status?: TodoStatus): Promise<Todo> {
    const todo = await TodoModel.findOneAndUpdate(
      { _id: id, userId },
      { title, description, status, updatedAt: new Date() },
      { new: true }
    );
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  async deleteTodo(id: string, userId: string): Promise<void> {
    const result = await TodoModel.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) {
      throw new Error('Todo not found');
    }
  }

  async listTodos(userId: string): Promise<Todo[]> {
    return TodoModel.find({ userId });
  }

  async markTodoStatus(id: string, userId: string, status: TodoStatus): Promise<Todo> {
    return this.updateTodo(id, userId, undefined, undefined, status);
  }
}