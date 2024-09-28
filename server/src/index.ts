import dotenv from 'dotenv';
dotenv.config();

import { MongoDBAdapter } from './infrastructure/adapters/mongodb.adapter';
import { JWTAdapter } from './infrastructure/adapters/jwt.adapter';
import { Server } from './infrastructure/express/server';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_app';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const PORT = parseInt(process.env.PORT || '3000', 10);

const mongodbAdapter = new MongoDBAdapter(MONGODB_URI);
const jwtAdapter = new JWTAdapter(JWT_SECRET);

const server = new Server(mongodbAdapter, jwtAdapter);


server.start(PORT).catch(console.error);