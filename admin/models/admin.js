const mongoose = require('mongoose')
const validator  = require('validator')

let date =  new Date().toUTCString();
const adminSchema = new mongoose.Schema({
 
    email : {
        type:String,
        required:true,
        unique:[true,"Email is already exist"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("Invaid Email")
            }
        }
    },
    password : {
        type:String,
        required:true,
    },
    created_at:{
        type:Date,
        default: date
    },
    
})


const Admin  = new mongoose.model('admin',adminSchema);
module.exports = Admin;
