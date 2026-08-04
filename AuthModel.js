const mongoose = require('mongoose') ;
const AuthSchema = mongoose.Schema({
    name:{
        type: String,
        required : true ,
        minlength : 2 ,
        maxlength : 64,
        trim : true
    },
    email : {
        type : String ,
        unique : true,
        required : true ,
        trim : true
    },
    password : {
        type : String,
        required : true ,
        trim : true ,
        minlength : 8
    }
},{timestamps : true});

const userModel = mongoose.model("User", AuthSchema);
module.exports = userModel;