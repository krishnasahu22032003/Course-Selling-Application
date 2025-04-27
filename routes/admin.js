const express = require('express');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const adminRouter = express.Router();
const { z } = require("zod")
const { adminModel } = require("../database")
const { courseModel } = require("../database")
const { JWT_ADMIN_SECRET } = require("../config");
const { adminmiddleware } = require('../middlewares/admin');

adminRouter.post('/signup', async function (req, res) {
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
    try {
        const hashedpassword = await bcrypt.hash(password, 5)
     
      await adminModel.create({
            email: email,
            password: hashedpassword,
            firstName: firstName,
            lastName: lastName
        })
        console.log("databse created")
    } catch (e) {
        res.json({
            msg: "error occured please check something is wrong"
        })
        thorwnerror = true
    }
    if (!thorwnerror) {
        res.json({
            msg: "you are signed up"
        })

    }

})

adminRouter.post('/signin', async function (req, res) {
    const email = req.body.email
    const password = req.body.password
    const admin = await adminModel.findOne({
        email: email,

    })
    if (!admin) {
        res.status(403).json({
            msg: "user dont exists"
        })
        return
    }
    const comparepassword = await bcrypt.compare(password, admin.password)
    console.log(admin)
    if (comparepassword) {
        const token = jwt.sign({
            id: admin._id
        }, JWT_ADMIN_SECRET)
        res.json({
            token: token
        })
    } else {
        res.status(403).send({
            msg: "incorrect credentias"
        })
    }
})


adminRouter.post('/create-course', adminmiddleware, async function (req, res) {
    const adminId = req.userId
    const { title, description, price, imageUrl } = req.body
    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorID: adminId
    })

    res.json({
        message: "Course created",
        courseId: course._id
    })
})
adminRouter.put("/update-course", adminmiddleware, async function(req, res) {
    const adminId = req.userId;

    const { title, description, imageUrl, price, courseId } = req.body;

    // creating a web3 saas in 6 hours
    const course = await courseModel.updateOne({
        _id: courseId, 
        creatorID:adminId
       
    }, {
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price,
       courseId:courseId
    })

    res.json({
        message: "Course updated",
        courseId:course._id
    })
})

adminRouter.get('/course-content',adminmiddleware,async function (req, res) {
    const adminId = req.userId;

    const courses = await courseModel.find({
     
        creatorID: adminId 
    });

    res.json({
        message: "these are the avaliable courses",
        courses
    })
})
module.exports = {
    adminRouter: adminRouter
}