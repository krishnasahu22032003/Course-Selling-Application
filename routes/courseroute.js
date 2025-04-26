const express = require('express');
const courserouter = express.Router();
const {purchaseModel, courseModel} = require ('../database');
const { usermiddleware } = require('../middlewares/user');
courserouter.post('/purchase', usermiddleware,async function(req,res){
const userId = req.userId
const courseId = req.body.courseId
await purchaseModel.create({
    userId,
    courseId
})

res.json({

    msg:"yoy have successfully bougth the course"
})
})
courserouter.get('/preview',async function(req,res){
const courses = await courseModel.find({})
res.json({
    courses,
 
})
})
module.exports={
    courserouter:courserouter
}