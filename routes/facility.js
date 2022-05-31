const express = require('express')
const router = express.Router()
const FacilityDB = require('../models/facility')

//all faciity route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.FacName != null && req.query.FacName !== ''){
        searchOptions.FacName = new RegExp(req.query.FacName, 'i')
    }
    try {
        const facilities = await FacilityDB.find(searchOptions)
        res.render('facility/index', {
            facilities: facilities,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//new facility route
router.get('/new', (req, res) => {
    res.render('facility/new', { facility: new FacilityDB() })
})

//new create route
router.post('/', async (req, res) => {
    const facility = new FacilityDB({
        FacName: req.body.FacName,
        FacType: req.body.FacType,
        FacNum: req.body.FacNum,
        FacImage: req.body.FacImage
    })
    try {
        const newFacility = await facility.save()
        //res.redirect(`facility/${newFacility.id}`)
        res.redirect('facility')
    } catch{
        res.render('facility/new', {
        facility: facility,
        errorMessage: 'ERROR CREATING FACILITY'
     })
   }
})

module.exports = router