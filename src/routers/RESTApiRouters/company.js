const express = require('express')
const router = new express.Router()
const Company = require('../../models/company')
const User = require('../../models/user')



// creat company data
router.post('/company', async (req, res) => {
    const company = new Company(req.body)
    try{
        await company.save()
        res.status(201).send(company)
    } catch(err){
        res.status(500).send(err)
    }
})


// get all companies for Market data
router.get('/company', async (req, res) => {
    try{
         const companies = await Company.find({})
         res.send(companies)
    } catch(err) {  
        res.status(500).send(err)
    }
})


// get companies attached to specific user
router.get('/company/user', async (req, res) => {
    try{
         await req.user.populate('company').execPopulate()
         res.send(req.user.company)
    } catch(err) {  
        res.status(500).send(err)
    }
})


module.exports = router