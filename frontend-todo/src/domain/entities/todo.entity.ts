import { TodoStatus } from '../value-objects/todo-status.vo';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  status: TodoStatus;
}