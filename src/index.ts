import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './server';

const startServer = async () => {
  try {
    const mongooseURL = process.env.ME_CONFIG_MONGODB_URL || '';
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
