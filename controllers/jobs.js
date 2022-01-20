const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const { NotFoundError } = require('../errors');

const createjob = async(req,res)=>{
    
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});

}

const getalljob = async(req,res)=>{
    const job = await Job.find({createdBy:req.user.userId}).sort('createdAt');
    res.status(StatusCodes.CREATED).json({job});
}


const getjob = async(req,res)=>{

   const {user:{userId},params:{id:jobId}} = req ;

   const job = await Job.findOne({createdBy:userId,_id:jobId});
   if(!job){
    throw new NotFoundError(`No job with id ${jobsId}`);
}

res.status(StatusCodes.CREATED).json({job});
  
}


const deletejob = async(req,res)=>{
   const {user:{userId},params:{id:jobId}} = req ;
   
   const job = await Job.findByIdAndRemove({createdBy:userId,_id:jobId});
 
   if(!job){
    throw new NotFoundError(`No job with id ${jobsId}`);
}

res.status(StatusCodes.CREATED).send();
  
}


const updatejob = async(req,res)=>{
    const {user:{userId},params:{id:jobId},body:{company,position}} = req;

    if(company === ' ' || position === ' '){
        throw new BadRequestError('company and position can be blank');
    }

    const job = await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{runValidators:true,new:true});
    
     if(!job){
    throw new NotFoundError(`No job with id ${jobsId}`);
}

res.status(StatusCodes.CREATED).send({job});

}

module.exports = {createjob,getalljob,getjob,deletejob,updatejob};