import mongoose from 'mongoose';

export class MongoDBAdapter {
  constructor(private uri: string) {}

  async connect(): Promise<void> {
    await mongoose.connect(this.uri);
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}