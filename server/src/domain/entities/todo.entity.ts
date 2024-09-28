import mongoose, { Document, Schema } from 'mongoose';
import { TodoStatus } from '../value-objects/todo-status.vo';

export interface Todo extends Document {
  userId: string;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: Object.values(TodoStatus), default: TodoStatus.PENDING },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const TodoModel = mongoose.model<Todo>('Todo', TodoSchema);