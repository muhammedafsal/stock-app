const mongoose = require('mongoose')
const validator = require('validator')

const companySchema = new mongoose.Schema({

    name : {
        type : String
     },
     ltp : {
        type : Number,
        default : 0
     },
     volume : {
        type : Number,
        default : 0
    },
    value : {
        type : Number,
        default : 0
    },

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})


const Company = mongoose.model('Company', companySchema)
module.exports = Company


const createInterval = () => {
    let num = Math.floor(Math.random() * 10)
    if(num % 2 == 0) {
        Company.updateMany({}, { $mul: { ltp : (1.002) } })
        .then(() => {} )
        .catch(error => console.log(error))
    } else {
        Company.updateMany({}, { $mul: { ltp : (0.998) } })
        .then(() => {} )
        .catch(error => console.log(error))
    }
}
const intervalId = setInterval(createInterval, 3000);



