import logger from 'pino';
const Logger = logger();

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
  });
  Logger.error(err.stack);
};

export { notFound, errorHandler };
