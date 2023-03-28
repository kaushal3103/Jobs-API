//const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  //now setting up custom errors

  let customError = {
    //setdefault
    statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'Something went wrong try again later'
  }

  //now we can remove this because upar customerror wale function
  //sai ab sab hojaega apna ez work
/*
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
*/
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  //bas upar wale ko ache sai likh diya hain
  //return res.status(customError.statusCode).json({msg:customError.msg});

  //now setting up mongoose validation

  if(err.name === 'ValidationError'){
   // console.log(Object.values(err.erros)); //arrays
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = 400
  }

  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  //ye wala return karwa k dekh le if(statment kai) msg code vgrah
  //pata chal jaengyai or object for mai aaega ye 

  if(err.code && err.code === 11000){    //key value is object and in javascript
    //we have object. in this case keys so 
    //in result we get arrays of keys
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    customError.statusCode = 400
  }

  //ab hum cast erros set kar re hain 
  //ye error tab aate hain jab jobs mai params ho
  //mtlb id wale mai values alag hai 
  //more than syntax ho 
  //mtlb id mai 2-3 values khud sai add krdi ho
  //tab ye errors aengyai

  //toh ab isko handle karengyai 
  if(err.name === 'CastError'){
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }

  return res.status(customError.statusCode).json({msg:customError.msg});
}

module.exports = errorHandlerMiddleware

//SECURITY kai liye 
//helmet package -> most popular which sets various http headers
//to prevent numerous possible attacks in fact helmet
// is so popular its actually used in many other packages


//cors package ->
// we want to implement corse
//library which just ensures that our api is accessible
//from diffrent domain
//jo hamne pichle apis bane thai woh bas usi javascript
//profile k liye hi accessible h
// or dusri jagah sai karengyai toh error ajega
//cors stand for cross origin resource sharing
//and it is a mechanism to allow or restrict requested resources
//on a web server depending on where the http request
//was initiated by installing and implementing the course package
//we make our api accessible to the public

//x package-> is a clean library which sanitizes the user
//input req.body req.query and params 
//and protect us from cross site scripting attacks 
//where the attackers  tries to inject some malicious code

//lastly we want to limit the amount of requests the user can make
//well do that with helo of express limit library

