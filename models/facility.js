const mongoose = require('mongoose')

const facilitySchema = new mongoose.Schema({
    FacName: {
        type: String,
        required: true
    },
    FacType: {
        type: String,
        required: true
    },
    FacNum: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now
    },
    FacImage: {
        type: Buffer,
        required: true
    },
    FacImageType: {
        type: String,
        required: true
    }
})

facilitySchema.virtual('coverImagePath').get(function() {
    if (this.FacImage != null && this.FacImageType != null) {
        return `data:${this.FacImageType};charset=utf-8;base64,${this.FacImage.toString('base64')}`
    }
})

module.exports = mongoose.model('FacilityDB', facilitySchema)