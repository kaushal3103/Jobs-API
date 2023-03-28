//start from here

const User = require('../models/User');

const {StatusCodes} = require('http-status-codes');
const {BadRequestError,UnauthenticatedError} = require('../errors');
//const bcrypt = require('bcryptjs');



const register = async(req,res)=>{
  //  const {name,email,password} = req.body;
    /*
    if( !name || !email || !password){
  throw new BadRequestError('Please Provide name,email and password');
    }
    we will use mongoose validators this is just for a look 
    */
//    const salt = await bcrypt.genSalt(10); //random bytes
//    const hashedPassword = await bcrypt.hash(password,salt);
    //to hash password we need to run two methods which
    //is gen salt and the actual hash method
//    const tempUser = {name,email,password:hashedPassword};

//  const user = await User.create({...tempUser});
    const user = await User.create({...req.body});
    //console.log(user);
    const token = user.createJWT();
   // const token = jwt.sign({userId:user._id,name:user.name},'jwtsecret',{
  //    expiresIn : '30d',
  //  });
   // console.log(token);
// res.status(StatusCodes.CREATED).json({user:{name : user.name},token});
res.status(StatusCodes.CREATED).json({user:{name : user.name},token});
 // res.send('register user');
}

const login = async(req,res)=>{
 const {email,password} = req.body;
 

 if(!email || !password){
   throw new BadRequestError('Please provide email and password');
 }

 const user = await User.findOne({email});

 if(!user){
   throw new UnauthenticatedError('Invalid credentials');

 }

  //compare password
  
  const isPasswordCorrect =await user.comparePassword(password);
  
  if(!isPasswordCorrect){
   throw new UnauthenticatedError('Invalid credentials');

 }

 const token = user.createJWT();
 res.status(StatusCodes.OK).json({user:{name:user.name},token})



}

module.exports = {
    register,login,
}

//as we can see our controllers is getting busy
//and if we kept on adding functionality to it 
// it may be bloated .. so to avoid this we will
//use in this mongoose middleware the end result
// will be same but logic will be lil diff