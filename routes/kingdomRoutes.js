import express from 'express';
import { listKingdoms } from '../controllers/kingdomController.js';

const router = express.Router();

router.get('/', listKingdoms);

export default router;