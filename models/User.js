//third one
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name'],
        minlength:3,
        maxlength:30,
    },
    email : {
        type: String,
        required: [true,'Pleade provide email id'],
        match : [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'please provide valid email'],
        unique : true, //create unique index,duplicate error message

        //match one which pretty much creates a validator
        //that checks if value matches the given regular
        //expression
        //to check for valid email
    },
    password:{
        type:String,
        required:[true,'Please provide password'],
        minlength:6,
       
    },
})

//this is our middleware which will do our password hashed using mongoose
    UserSchema.pre('save',async function(next){
        const salt = await bcrypt.genSalt(10);
        
        this.password = await bcrypt.hash(this.password,salt);
        next();

        //even if we remove both of next it still gonna work
        //its await/async
    })

//mongoose instance methods
//getting username
//ham bas function bana bana kai kar rahe taaki
//using monggose instances
//messy na lage
//this mtlb document
//toh mtlb ab hame register mai bas createjwt hi invokde karna hoga
// bas baaki sab set hai 
UserSchema.methods.createJWT = function (){
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME});
}

//ab hum password copmares kar re hai login wale mai
//ye same xhisz hum wahan kar skte thai lekin
// ham yahan kar re hain

UserSchema.methods.comparePassword = async function (candiatePassword){
    //the password we are wrting in login
    const isMatch = await bcrypt.compare(candiatePassword,this.password);
    
    return isMatch;
}

module.exports =mongoose.model('User',UserSchema);
