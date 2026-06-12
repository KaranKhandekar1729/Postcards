import express from 'express';
import {
    createPostcard,
    getAllPostcards,
    getPostcard,
    updatePostcard,
    deletePostcard
} from '../controllers/postcard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, getAllPostcards);
router.get('/:slug', authenticate, getPostcard);

router.post('/', authenticate, createPostcard);
router.patch('/:id', authenticate, updatePostcard);
router.delete('/:id', authenticate, deletePostcard);

export default router;