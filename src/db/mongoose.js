const mongoose = require('mongoose')

// mongodb cluster connection
mongoose.connect('mongodb+srv://afsal123:afs12345@stock-cluster.xgdct.mongodb.net/stock-app?retryWrites=true&w=majority', {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true
})
.then(() => console.log('MongoDB has connected'))
.catch(() => console.log('Unable to connect with MongDB'))


