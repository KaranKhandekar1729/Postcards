import mongoose from 'mongoose'

const envelopeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Title can be max 20 characters only']
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
        },
        fabricData: {
            type: Object,
            required: true,
        },
    },
    // Letter content/design
    letter: {
        backgroundColor: {
            type: String,
            default: '#fffaf0'
        },
        fabricData: {
            type: Object,
            required: true,
        },
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

envelopeSchema.pre('save', async function () {
    if (!this.isModified('title')) return

    let slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    const exisitingEnvelope = await mongoose
        .model('Postcard')
        .findOne({ slug });

    if (exisitingEnvelope && exisitingEnvelope._id.toString() !== this._id.toString()) {
        slug = `${slug}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    this.slug = slug;
});

envelopeSchema.pre('save', function() {
    if (this.isModified('status') && this.status === 'sent' && !this.sentAt) {
        this.sentAt = new Date();
    }
});

const Envelope = mongoose.model('Envelope', envelopeSchema);

export default Envelope;