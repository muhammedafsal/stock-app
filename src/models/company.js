const mongoose = require('mongoose')
const validator = require('validator')

const companySchema = new mongoose.Schema({

    name : {
        type : String,
        
     },
     ltp : {
         type : Number,
         default : 0
     },
     volume : {
        type : Number,
        default : 0
    },

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})




const Company = mongoose.model('Company', companySchema)




// const interwel = setInterval(() => {
//     Company.updateMany({}, { $mul: { ltp : Math.random() } })
//     .then(() => {} ).catch(error => console.log(error))
//     //console.log('Ting Tong')
// }, 10000)



module.exports = Company
