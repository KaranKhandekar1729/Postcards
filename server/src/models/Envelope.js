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
        color: {
            type: String,
            default: '#ffffff'
        },
        fabricData: Object
    },

    // Letter content/design
    letter: {
        color: {
            type: String,
            default: '#fffaf0'
        },
        fabricData: Object
    }
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
    
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    const token = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')

    slug = `${slug}-${token}`

    this.slug = slug;
});

const Envelope = mongoose.model('Envelope', envelopeSchema);

export default Envelope;