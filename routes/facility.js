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
        res.redirect(`facility/${newFacility.id}`)
    } catch{
        renderNewPage(res, facility, true)
   }
})

router.get('/:id',  async (req, res) => {
    try {
        const facility = await FacilityDB.findById(req.params.id)
        res.render('facility/show', {facility: facility})
    } catch (error) {
        res.redirect('/')
    }
})

//edit facility route
router.get('/:id/edit', async (req, res) => {
    try {
        const facility = await FacilityDB.findById(req.params.id)
        res.render('facility/edit', { facility: facility})
    } catch {
        res.redirect('/facility')
    }
    
})

//update facility route
router.put('/:id', async (req, res) => {
    let facility
    try {
        facility = await FacilityDB.findById(req.params.id)
        facility.FacName = req.body.FacName
        facility.FacType = req.body.FacType
        facility.FacNum = req.body.FacNum
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(facility, req.body.cover)
        }
        await facility.save()
        res.redirect(`/facility/${facility.id}`)
    } catch {
        if (facility != null){
            renderEditPage(res, book, true)
        } else {
            redirect('/')
        }
    }
})

router.delete('/:id', async (req, res) => {
    let facility
    try {
        facility = await FacilityDB.findById(req.params.id)
        await facility.remove()
        res.redirect('/facility')
    } catch {
        if (facility == null){
            res.redirect('/')
        } else {
            res.render(`/facility/${facility.id}`)
        }
    }
})

async function renderNewPage(res, facility, hasError = false){
    renderFormPage(res, facility, 'new', hasError)
}

async function renderEditPage(res, facility, hasError = false){
    renderFormPage(res, facility, 'edit', hasError)
}

async function renderFormPage(res, facility, form, hasError = false){
    try {
        const facility = await FacilityDB.find({})
        const params = {
            facility: facility
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'ERROR UPDATING COURT'
            }else{
                params.errorMessage = 'ERROR CREATING COURT'
            }
        }
        res.render(`facility/${form}`, params)
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