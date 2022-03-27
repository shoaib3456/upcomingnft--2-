const mongoose = require('mongoose')
const validator  = require('validator')

let date =  new Date().toUTCString();
const intrestSchema = new mongoose.Schema({
 
    user_email : {
        type:String,
        required:true,
    },
    project_id : {
        type:String,
        required:true,
    },
    intrest: {
        type:Number,
        default: 0
    },
    created_at:{
        type:Date,
        default: date
    },
    
})


const IntrestLog  = new mongoose.model('intrest',intrestSchema);
module.exports = IntrestLog;
