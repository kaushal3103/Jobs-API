const User = require('../models/User');
const {UnauthenticatedError,BadRequestError} =require('../errors');
const { StatusCodes } = require('http-status-codes');


 const register = async function(req,res){
     
     const user = await User.create({...req.body});
     const token =  user.createJWT();
    return res.status(StatusCodes.CREATED).json({user:{name:user.name},token});
     
 }

 const login = async function(req,res){

     const {email,password} = req.body ;

     if(!email || !password){
         throw new BadRequestError('Please enter name and password');
     }

     const user = await User.findOne({email});
     if(!user){
       throw new UnauthenticatedError('invalid credientials');
     }

     const correcpass = await user.comparePassword(password) ;     
     if(!correcpass){
       throw new UnauthenticatedError('invalid credientials');
     }
  
     const token = user.createJWT();

     return res.status(StatusCodes.OK).json({user:{user:user.name},token})

 } 

 module.exports = {register,login};