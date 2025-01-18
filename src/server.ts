import express, { Express } from 'express';
import morgan from 'morgan';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import appointmentRoutes from './routes/appointment';
import appointmentAttendeesRoutes from './routes/appointmentAttendees';
import { notFound } from './middleware/not-found';
import { globalErrorHandler } from './middleware/error';

const app: Express = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth/', authRoutes);
app.use('/api/v1/user/', userRoutes);
app.use('/api/v1/appointment/', appointmentRoutes);
app.use('/api/v1/attendees/', appointmentAttendeesRoutes);

app.use('*', notFound);

app.use(globalErrorHandler);

export default app;
