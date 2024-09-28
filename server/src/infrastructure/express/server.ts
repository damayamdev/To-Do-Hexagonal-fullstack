import express from 'express';
import cors from 'cors';
import { MongoDBAdapter } from '../adapters/mongodb.adapter';
import { JWTAdapter } from '../adapters/jwt.adapter';
import { UserRepository } from '../repositories/user.repository';
import { TodoRepository } from '../repositories/todo.repository';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { TodoUseCase } from '../../application/use-cases/todo.use-case';
import { authRouter } from './routes/auth.routes';
import { todoRouter } from './routes/todo.routes';
import { authMiddleware } from './middlewares/auth.middleware';
import helmet from 'helmet';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware';
import { csrfMiddleware } from './middlewares/csrf.middleware';
import cookieParser from 'cookie-parser';
import compression from 'compression';

export class Server {
  private app: express.Application;

  constructor(
    private mongodbAdapter: MongoDBAdapter,
    private jwtAdapter: JWTAdapter
  ) {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    this.app.set('trust proxy', 1);
    this.app.use(helmet());


    const corsOptions: cors.CorsOptions = {
      origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:5174'],
      optionsSuccessStatus: 200,
      credentials: true, // Allow credentials
    };
    this.app.use(cors(corsOptions));
    this.app.use(cookieParser());

    this.app.use(express.json({ limit: '10kb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    this.app.use(compression());
    
    this.app.use(rateLimitMiddleware);
    //this.app.use(csrfMiddleware);

    this.app.use(express.json());

  }

  private setupRoutes() {
    const userRepository = new UserRepository(this.jwtAdapter);
    const todoRepository = new TodoRepository();

    const authUseCase = new AuthUseCase(userRepository);
    const todoUseCase = new TodoUseCase(todoRepository);

    this.app.use('/api/auth', authRouter(authUseCase));
    this.app.use('/api/todos', todoRouter(todoUseCase, authMiddleware(authUseCase), authUseCase));

    /*this.app.get('/api/csrf-token', (req, res) => {
      res.json({ csrfToken: req.csrfToken() });
    });*/
    // Handle 404
    this.app.use((req, res) => {
      res.status(404).json({ message: 'Not Found' });
    });
  }

  async start(port: number) {
    await this.mongodbAdapter.connect();
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}