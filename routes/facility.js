const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const FacilityDB = require('../models/facility')
const uploadPath = path.join('public', FacilityDB.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

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
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const facility = new FacilityDB({
        FacName: req.body.FacName,
        FacType: req.body.FacType,
        FacNum: req.body.FacNum,
        FacImage: fileName
    })
    try {
        const newFacility = await facility.save()
        //res.redirect(`facility/${newFacility.id}`)
        res.redirect(`facility`)
    } catch{
        if (facility.FacImage != null){
            removeFacCover(facility.FacImage)
        }
        renderNewPage(res, facility, true)
   }
})

function removeFacCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if (err) console.error(err)
    })
}

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

module.exports = router