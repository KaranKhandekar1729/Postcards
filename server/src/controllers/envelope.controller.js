import Envelope from "../models/Envelope.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// POST /api/envelope
export const createEnvelope = asyncHandler(async (req, res) => {

    const envelope = await Envelope.create({
        ...req.body,
        author: req.user._id
    });

    res.status(201).json({
        success: true,
        data: envelope,
    });
});

// GET /api/envelope
export const getAllEnvelopes = asyncHandler(async (req, res) => {
    const filter = {
        author: req.user._id
    };

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const sort = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 }

    const [envelope, total] = await Promise.all([
        Envelope.find(filter)
            .populate('author', 'username')
            .select('-letter')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        
        Envelope.countDocuments(filter)
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
        data: envelope,
    });
});

// GET /api/envelope/:slug
export const getEnvelope = asyncHandler(async (req, res) => {
    const envelope = await Envelope.findOne({
        slug: req.params.slug,
    }).populate('author', 'username');

    if (!envelope) throw new AppError('Envelope not found', 404);

    res.status(200).json({
        success: true,
        data: envelope,
    });  
});

// PATCH /api/envelope/:id
export const updateEnvelope = asyncHandler(async (req, res) => {
    const envelope = await Envelope.findById(req.params.id);

    if (!envelope) throw new AppError('Envelope not found', 404);

    const isAuthor = envelope.author.toString() === req.user._id.toString()
    if (!isAuthor) {
        throw new AppError('You are not allowed to update this envelope', 403)
    }

    const allowedFields = ['title', 'from', 'to', 'background', 'envelope', 'letter'];
    const updates = {};

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    console.log('updates:', updates);
    
    const updatedEnvelope = await Envelope.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { returnDocument: 'after', runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedEnvelope });
});

// DELETE /api/envelope/:id
export const deleteEnvelope = asyncHandler(async (req, res) => {
    const envelope = await Envelope.findById(req.params.id);

    if (!envelope) throw new AppError('Envelope not found', 404);

    const isAuthor = envelope.author.toString() === req.user._id.toString();
    if (!isAuthor) {
        throw new AppError('You are not allowed to delete this envelope', 403);
    }
    
    await envelope.deleteOne();

    res.status(204).json({ success:  true, data: null });
})