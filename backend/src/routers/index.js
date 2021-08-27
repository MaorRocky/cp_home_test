import likesRouter from './likes.routers.js';
import postRouter from './posts.routers.js';
import express from 'express';


function initRouters(app) {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(likesRouter);
  app.use(postRouter);
}

export default initRouters;
