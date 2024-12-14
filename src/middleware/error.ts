import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

const sendDevError = (error: AppError, res: Response) => {
  return res.status(error.statusCode).json({
    statusCode: error.statusCode,
    status: error.status,
    message: error.message,
    stack: error.stack,
    error: error,
  });
};

const sendProdError = (error: AppError, res: Response) => {
  if (error.isOperational)
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      status: error.status,
    });

  console.log('ERROR: ', error);

  return res.status(500).json({
    statusCode: 500,
    message: 'Something went wrong',
    status: 'error',
  });
};

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

const handleDuplicateErrorDB = (err: any) => {
  const [value] = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value: ${value}, please use another value!`;
  return new AppError(400, message);
};

const handleJwtInvalidError = () => {
  return new AppError(401, 'Invalid token.');
};

const handleJwtExpiredError = () => {
  return new AppError(401, 'Your token is expired, please login again!');
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((error: any) => error.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(400, message);
};

const handleZodeError = (err: any) => {
  const errors = err.issues.map((error: any) => error.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(400, message);
};

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(error, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let err = { ...error };

    if (error.name === 'CastError') {
      err = handleCastErrorDB(error);
    }

    if (error.code === 11000) {
      err = handleDuplicateErrorDB(error);
    }

    if (error.name === 'ValidationError') {
      err = handleValidationErrorDB(error);
    }

    if (error.name === 'JsonWebTokenError') {
      err = handleJwtInvalidError();
    }

    if (error.name === 'TokenExpiredError') {
      err = handleJwtExpiredError();
    }

    if (error.name === 'ZodError') {
      err = handleZodeError(error);
    }

    sendProdError(err, res);
  }
};
