import { Router } from 'express';
import { TodoUseCase } from '../../../application/use-cases/todo.use-case';
import { TodoStatus } from '../../../domain/value-objects/todo-status.vo';
import { AuthUseCase } from '../../../application/use-cases/auth.use-case';

export const todoRouter = (todoUseCase: TodoUseCase, authMiddleware: any, authUseCase: AuthUseCase) => {
  const router = Router();

  router.post('/', authMiddleware, async (req, res) => {
    try {
      const { title, description } = req.body;
      const todo = await todoUseCase.createTodo(req.user.id, title, description);
      res.status(201).json(todo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;
      const todo = await todoUseCase.updateTodo(id, req.user.id, title, description, status);
      res.json(todo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await todoUseCase.deleteTodo(id, req.user.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.get('/', authMiddleware, async (req, res) => {
    try {
      const todos = await todoUseCase.listTodos(req.user.id);
      res.json(todos);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.patch('/:id/status', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const todo = await todoUseCase.markTodoStatus(id, req.user.id, status as TodoStatus);
      res.json(todo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.get('/me', authMiddleware, async (req , res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      const userResponse = {
        id: user.id,
        email: user.email
      };
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
};