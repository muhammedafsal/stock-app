const express = require('express')
const router = new express.Router()
const Company = require('../models/company')
const User = require('../models/user')
const auth = require('../middleware/auth')


router.post('/company', async (req, res) => {
    //const company = new Company({...req.body, owner : req.user._id})
    const company = new Company(req.body)
    try{
        await company.save()
        res.status(201).send(company)
    } catch(err){
        res.status(500).send(err)
    }
})

router.get('/company', async (req, res) => {
    try{
        // await req.user.populate('company').execPopulate()
        // res.send(req.user.company)
         const companies = await Company.find({})
         res.send(companies)
    } catch(err) {  
        res.status(500).send(err)
    }
})

router.get('/company/:id', auth, async (req, res) =>{
    const id = req.params.id
    try{
        const company = await Company.findOne({_id : id, owner : req.user._id})
        if(!company) return res.status(404).send()
        res.send(company)
    } catch(err) {  
        Response.status(500).send(err)
    }
})

router.patch('/company/:id', auth, async (req, res) =>{
    const id = req.params.id;
    const updates = Object.keys(req.body)
    try{
        const company = await Company.findOne({_id : id, owner : req.user._id})
        
        if(!company) return res.status(404).send('company not found')

        updates.forEach(cur => company[cur] = req.body[cur])
        await company.save()

        res.send(company)
    } catch(err) {
        res.status(500).send('some issue ')
    }
})

router.delete('/company/:id', auth, async (req, res) =>{
    const id = req.params.id
    try{
        
        const company = await Company.findOneAndDelete({_id : id, owner : req.user._id})
        if(!company) return res.status(404).send('company not found')
        res.send(company)
    } catch(err) {
        res.status(500).send(err)
    }
})


module.exports = router