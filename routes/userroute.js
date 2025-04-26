const express = require('express');
const bcrypt = require("bcrypt")
const userRouter = express.Router();
const jwt = require("jsonwebtoken")
const { z } = require("zod")
const {usermiddleware} = require("../middlewares/user")
const {JWT_USER_SECRET} =require("../config")
const { userModel, purchaseModel, courseModel } = require('../database');



userRouter.post('/signUp', async function (req, res) {

    const requiredbody = z.object({
        email: z.string().min(5).max(50).email(),
        password: z.string().min(5).max(50).regex(/[a-z]/).regex(/[A-Z]/),
        firstName: z.string().min(4).max(30),
        lastName: z.string().min(4).max(30)
    })
    const parsedata = requiredbody.safeParse(req.body)
    if (!parsedata.success) {
        res.json({
            msg: "incorrect credentials",
            error: parsedata.error
        })
        return
    }
    const email = req.body.email
    const password = req.body.password
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    let thorwnerror = false
   try{ const hashedpassword = await bcrypt.hash(password,5)
    console.log(hashedpassword)
    await userModel.create({
        email: email,
        password: hashedpassword,
        firstName: firstName,
        lastName: lastName
    })
}catch(e){
    res.json({
        msg: "error occured please check something is wrong"
    })
    thorwnerror=true
}
if(!thorwnerror){
    res.json({
        msg:"you are signed up"
    })

}
    
})

userRouter.post('/signIn', async function (req, res) {
    const email = req.body.email
    const password = req.body.password
    const user = await userModel.findOne({
        email: email,

    })
    if (!user) {
        res.status(403).json({
            msg:"user dont exists"
          })
          return
    }
    const comparepassword = await bcrypt.compare(password,user.password)
console.log(user)
if(comparepassword){
    const token = jwt.sign({ id: user._id }, JWT_USER_SECRET);

    res.json({
        token:token
    })
}else{
    res.status(403).send({
        msg:"incorrect credentias"
    })
}
})




userRouter.get('/purchases', usermiddleware , async function (req, res) {
    console.log("REQ.USERID:", req.userId)
const userId = req.userId
const purchases = await purchaseModel.find({
    userId,

})
const coursesdata = await courseModel.find({
    _id:{$in:purchases.map(x=>x.courseId)}
})

res.json({
   userId,
    purchases,
  coursesdata
})
})

module.exports = {
    userRouter: userRouter,

}
