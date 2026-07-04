import express from 'express';
import {
    createEnvelope,
    getAllEnvelopes,
    getEnvelope,
    updateEnvelope,
    deleteEnvelope
} from '../controllers/envelope.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, getAllEnvelopes);
router.get('/:slug', getEnvelope);

router.post('/', authenticate, createEnvelope);
router.patch('/:id', authenticate, updateEnvelope);
router.delete('/:id', authenticate, deleteEnvelope);

export default router;