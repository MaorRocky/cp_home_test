import express from 'express';
import { docs } from '../controllers/docs.controllers.js';
const router = express.Router();

router.get('/', docs);

export default router;
