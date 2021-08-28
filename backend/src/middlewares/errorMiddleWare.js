import logger from 'pino';
import mongoose from 'mongoose';
const Logger = logger();

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: 'somthing went wrong',
  }); 
  Logger.error(err.stack, err.message);
};

const validIdHandler = (req, res, next) => {
  const { id } = req.params;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error('Invalid id');
  } else {
    next();
  }
};

export { notFound, errorHandler, validIdHandler };
