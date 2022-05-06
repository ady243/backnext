import { ConnectOptions } from 'mongoose';
import pino from 'pino';
declare const connectMongoose: (url: string, options: ConnectOptions, local: boolean, logger: pino.Logger) => Promise<void>;
export default connectMongoose;
