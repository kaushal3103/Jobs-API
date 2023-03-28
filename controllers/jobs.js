const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError,NotFoundError} = require('../errors');


const getAllJobs = async(req,res)=>{
    //get all jobs ka matlb ye hai ki
    // jo particular user sp availble hain
// res.send('get all jobs');

const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt');

res.status(StatusCodes.OK).json({jobs,count:jobs.length})

}

const getJob = async(req,res)=>{
 //res.send('get job');
 const {user:{userId},params:{id:jobId}} = req;
 

 const job = await Job.findOne({
     _id:jobId,createdBy:userId
 });

 if(!job){
     throw new NotFoundError(`No job with id ${jobId}`);
 }

 res.status(StatusCodes.OK).json({job});
}

const createJob = async(req,res)=>{
 //res.send('create job');
 //res.json(req.user);

 req.body.createdBy = req.user.userId ;
 
 //ye created by body hamne models mai banai hai

 //we are missing the user ! which is located in req.user
 //so we are looking here is id
 const job = await Job.create(req.body);
 
 res.status(StatusCodes.CREATED).json({job});
  
}

const updateJob = async(req,res)=>{
// res.send('update job');

const { 
    
body : {company, position},
user : {userId},
params : { id: jobId},
} = req ;

if( company === '' || position === ''){
    throw new BadRequestError('Company or position fileds cannot be empty');
}

//{1}->ye change karna hai
//req.body isai change karna hai 
//{new} matlb update jobmile or run validators chale
const job = await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true});

if(!job){
    throw new NotFoundError(`No job with id ${jobId}`);
}
res.status(StatusCodes.OK).json({job});
}

const deleteJob = async(req,res)=>{
 //res.send('deletejobs');

 const {user:{userId},params:{id:jobId}} = req;
 
 const job = await Job.findByIdAndRemove({
     _id:jobId,
     createdBy:userId
 });

if(!job){
    throw new NotFoundError(`No job with id ${jobId}`);
}
res.status(StatusCodes.OK).send();

}


module.exports = {
    getAllJobs,getJob,createJob,updateJob,deleteJob
}