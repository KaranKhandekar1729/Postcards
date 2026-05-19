import mongoose from 'mongoose'

const elementSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['text', 'sticker'],
        required: true
    },

    content: {
        type: String,
        maxLength: 500,
        trim: true
    },

    assetUrl: {
        type: String
    },
    
    // relative positioning: x/y percentage from direction
    x: {
        type: Number,
        min: 0,
        max: 1,
        required: true
    },

    y: {
        type: Number,
        min: 0,
        max: 1,
        required: true
    }, 

    width: {
        type: Number,
        min: 0.02,
        max: 1,

        validate: {
            validator: function(value) {
                if (value == null || this.x == null) return true;
                return this.x + value <= 1;
            },
            message: 'Element exceeds horizontal bounds'
        }
    },

    height: {
        type: Number,
        min: 0.02, // 2% of container to prevent size being tooo small
        max: 1,

        validate: {
            validator: function(value) {
                if (value == null || this.y == null) return true;
                return this.y + value <= 1;
            },
            message: 'Element exceeds vertical bounds'
        }
    },

    rotation: {
        type: Number,
        default: 0
    },

    zIndex: {
        type: Number,
        default: 0
    },

    fontSize: {
        type: Number,
        min: 12,
        max: 64,
        default: 12,
    },

    fontFamily: {
        type: String,
        default: 'Arial'
    },

    color: {
        type: String,
        default: '#000000'
    }
}, {
    _id: true
});

export default elementSchema;