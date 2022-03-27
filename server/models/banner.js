const mongoose = require('mongoose')
const validator  = require('validator')

let date =  new Date().toUTCString();
const bannertSchema = new mongoose.Schema({
 
    image : {
        type:String,
        required:true,
    },
    link : {
        type:String,
        required:true,
    },
    created_at:{
        type:Date,
        default: date
    },
})


const Banner  = new mongoose.model('banner',bannertSchema);
module.exports = Banner;
