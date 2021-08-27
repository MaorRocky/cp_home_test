import likesRouter from './likes.routers.js';
import postRouter from './posts.routers.js';
import helloRouter from './hello.routers.js';
import express from 'express';
import { notFound, errorHandler } from '../middlewares/errorMiddleWare.js';

function initRouters(app) {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(likesRouter);
  app.use(postRouter);
  app.use(helloRouter);
  app.use(notFound);
  app.use(errorHandler);
}

export default initRouters;
