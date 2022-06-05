const express = require('express')
const router = express.Router()
const FacilityDB = require('../models/facility')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']


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
router.get('/new', async (req, res) => {
    renderNewPage(res, new FacilityDB())
})

//create facility route
router.post('/', async (req, res) => {
    const facility = new FacilityDB({
        FacName: req.body.FacName,
        FacType: req.body.FacType,
        FacNum: req.body.FacNum,
    })
    saveCover(facility, req.body.cover)
    try {
        const newFacility = await facility.save()
        //res.redirect(`facility/${newFacility.id}`)
        res.redirect(`facility`)
    } catch{
        renderNewPage(res, facility, true)
   }
})

async function renderNewPage(res, facility, hasError = false){
    try {
        const facility = await FacilityDB.find({})
        const params = {
            facility: facility
        }
        if (hasError) params.errorMessage = 'ERROR CREATING FACILITIES'
        res.render('facility/new', params)
    } catch{
        res.redirect('/facility')
    }
}

function saveCover(facility, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        facility.FacImage = new Buffer.from(cover.data, 'base64')
        facility.FacImageType = cover.type
    }
}

module.exports = router