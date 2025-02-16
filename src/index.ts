import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './server';

const startServer = async () => {
  try {
    const mongooseURL = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST_NAME}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_INITDB_DATABASE}?authSource=admin`;
    await mongoose.connect(mongooseURL);

    console.log('Database connected succefully!');

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running at port: ${port}`);
    });
  } catch (error) {
    console.log('error occured', error);
  }
};

startServer();
