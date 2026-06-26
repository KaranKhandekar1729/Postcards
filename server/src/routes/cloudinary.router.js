import cloudinary from 'cloudinary';
import express from 'express'
import dotenv from 'dotenv';

dotenv.config()

const router = express.Router()

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUD_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUD_API_SECRET = process.env.CLOUDINARY_API_SECRET

// GET /api/signature
router.get('/signature', (req, res) => {
    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign = {
        timestamp,
        folder: 'envelope-uploads',
    };

    const signature = cloudinary.v2.utils.api_sign_request(
        paramsToSign,
        CLOUD_API_SECRET
    )

    res.json({
        signature,
        timestamp,
        cloudName: CLOUD_NAME,
        apiKey: CLOUD_API_KEY,
        folder: 'envelope-uploads',
    })
})

export default router;