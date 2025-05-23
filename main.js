require('dotenv').config();
const express = require('express');
const mongoose = require ('mongoose')
const cookieParser = require ('cookie-parser')
const bcrypt = require ("bcrypt")
const {z}= require("zod")
const {userRouter} = require('./routes/userroute');
const {courserouter} = require('./routes/courseroute')
const {adminRouter} = require('./routes/admin')
const app = express();
app.use(express.json())

app.use('/user',userRouter)
app.use('/course',courserouter)
app.use('/admin',adminRouter)
async function main(){
await mongoose.connect(process.env.MONGO_URL)
app.listen(3000)
console.log("connecting to the database")
}
main()