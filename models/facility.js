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
        type: String,
        required: true
    },
    FacImage: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('FacilityDB', facilitySchema)