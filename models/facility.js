const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/facilityCovers'

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
        type: String,
        required: true
    }
})

facilitySchema.virtual('coverImagePath').get(function() {
    if (this.FacImage != null) {
        return path.join('/', coverImageBasePath, this.FacImage)
    }
})

module.exports = mongoose.model('FacilityDB', facilitySchema)
module.exports.coverImageBasePath = coverImageBasePath