import express from 'express';
import { docs } from '../controllers/hello.controllers.js';
const router = express.Router();

router.get('/', docs);

export default router;
