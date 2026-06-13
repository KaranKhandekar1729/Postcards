import Postcard from "../models/Postcard.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// POST /api/postcards
export const createPostcard = asyncHandler(async (req, res) => {

    const postcard = await Postcard.create({
        ...req.body,
        author: req.user._id
    });

    res.status(201).json({
        success: true,
        data: postcard,
    });
});

// GET /api/postcards
export const getAllPostcards = asyncHandler(async (req, res) => {
    const filter = {
        author: req.user._id,
        status: { $in: ['draft', 'sent', 'scheduled'] }
    };

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const sort = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 }

    const [postcard, total] = await Promise.all([
        Postcard.find(filter)
            .populate('author', 'username email')
            .select('-letter')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        
        Postcard.countDocuments(filter)
    ]);

    res.status(200).json({
        success: true,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        },
        data: postcard,
    });
});

// GET /api/postcards/:slug
export const getPostcard = asyncHandler(async (req, res) => {
    const postcard = await Postcard.findOne({
        slug: req.params.slug,
    }).populate('author', 'username email');

    if (!postcard) throw new AppError('Postcard not found', 404);

    res.status(200).json({
        success: true,
        data: postcard,
    });  
});

// PATCH /api/postcards/:id
export const updatePostcard = asyncHandler(async (req, res) => {
    const postcard = await Postcard.findById(req.params.id);

    if (!postcard) throw new AppError('Postcard not found', 404);

    const isAuthor = postcard.author.toString() === req.user._id.toString()
    if (!isAuthor) {
        throw new AppError('You are not allowed to update this postcard', 403)
    }

    const allowedFields = ['title', 'from', 'to', 'thumbnail', 'fabricData', 'status', 'envelope', 'letter', 'scheduledFor'];
    const updates = {};

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    console.log('updates:', updates);
    
    await Postcard.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { returnDocument: 'after', runValidators: true }
    );

    res.status(200).json({ success: true, data: postcard });
});

// DELETE /api/postcards/:id
export const deletePostcard = asyncHandler(async (req, res) => {
    const postcard = await Postcard.findById(req.params.id);

    if (!postcard) throw new AppError('Postcard not found', 404);

    const isAuthor = postcard.author.toString() === req.user._id.toString();
    if (!isAuthor) {
        throw new AppError('You are not allowed to delete this postcard', 403);
    }
    
    await postcard.deleteOne();

    res.status(204).json({ success:  true, data: null });
})