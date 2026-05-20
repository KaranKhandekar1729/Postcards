import express from 'express';
import {
    createPostcard,
    getAllPostcards,
    getPostcard,
    updatePostcard,
    deletePostcard
} from '../controllers/postcard.controller.js';

const router = express.Router();

router.get('/', getAllPostcards);
router.get('/:slug', getPostcard);

router.post('/', createPostcard);
router.patch('/:id', updatePostcard);
router.delete('/:id', deletePostcard);

export default router;