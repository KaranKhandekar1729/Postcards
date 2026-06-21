import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import multer from 'multer';
import express from 'express'
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config()

const router = express.Router()

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
        folder: 'envelope-uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 1000, crop: 'limit' }]
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }
});

router.post('/', upload.single('file'), (req, res, next) => {
    console.log('file:', req.file);
    console.log('error check');
    if (!req.file) return res.status(400).json({ error: 'No file received' });

    res.json({ url: req.file.path });
});

export default router;