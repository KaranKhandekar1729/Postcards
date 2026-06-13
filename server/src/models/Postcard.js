import mongoose from 'mongoose'
import elementSchema from './Element.js'

const postcardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Title can be max 20 characters only']
    },

    thumbnail: {
        type: String,
        required: true,
    },

    fabricData: {
        type: Object,
        required: true,
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },

    from: {
        type: String,
        trim: true,
        required: true
    },

    to: {
        type: String,
        trim: true,
        required: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Envelope design
    envelope: {
        envelopeColor: {
            type: String,
            default: '#ffffff'
        }
    },
    // Letter content/design
    letter: {
        backgroundColor: {
            type: String,
            default: '#fffaf0'
        }
    },

    status: {
        type: String,
        enum: ['draft', 'sent', 'scheduled'],
        default: 'draft',
    },

    sentAt: {
        type: Date,
        default: null
    },

    scheduledFor: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true
});

postcardSchema.pre('save', async function () {
    if (!this.isModified('title')) return

    let slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    const exisitingPostcard = await mongoose
        .model('Postcard')
        .findOne({ slug });

    if (exisitingPostcard && exisitingPostcard._id.toString() !== this._id.toString()) {
        slug = `${slug}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    this.slug = slug;
});

postcardSchema.pre('save', function() {
    if (this.isModified('status') && this.status === 'sent' && !this.sentAt) {
        this.sentAt = new Date();
    }
});

const Postcard = mongoose.model('Postcard', postcardSchema);

export default Postcard;