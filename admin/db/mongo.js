const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://upcomingnfts:vamsikrishna99@upcomingnfts.yvtzo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection success");
}).catch((e)=>{
    console.log("connection failed "+e);
})

