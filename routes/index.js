const express = require('express')
const router = express.Router()
const Facility = require('../models/facility')

router.get('/', async(req, res) => {
    let facilities
    try {
        facilities = await Facility.find().sort({ createdAt: 'desc'}).limit(10).exec()
    } catch{
        facilities = []
    }
    res.render('index', {facilities: facilities})
})

module.exports = router