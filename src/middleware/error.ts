import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { DEVELOPMENT, ERROR_TYPE, PRODUCTION } from '../utils/constants';

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

  if (process.env.NODE_ENV === DEVELOPMENT) {
    sendDevError(error, res);
  }

  if (process.env.NODE_ENV === PRODUCTION) {
    let err = { ...error };

    if (error.name === ERROR_TYPE.CAST_ERROR) {
      err = handleCastErrorDB(error);
    }

    if (error.code === 11000) {
      err = handleDuplicateErrorDB(error);
    }

    if (error.name === ERROR_TYPE.VALIDATION_ERROR) {
      err = handleValidationErrorDB(error);
    }

    if (error.name === ERROR_TYPE.JSON_WEB_TOKEN_ERROR) {
      err = handleJwtInvalidError();
    }

    if (error.name === ERROR_TYPE.TOKEN_EXPIRED_ERROR) {
      err = handleJwtExpiredError();
    }

    if (error.name === ERROR_TYPE.ZOD_ERROR) {
      err = handleZodeError(error);
    }

    sendProdError(err, res);
  }
};
