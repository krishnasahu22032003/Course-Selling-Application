const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
console.log("are u connected")
mongoose.connect(process.env.MONGO_URL)
// ✅ Define user schema
const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String
});

// ✅ Define admin schema
const adminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String
});

// ✅ Define course schema
const coursesSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorID: ObjectId
});

// ✅ Define purchase schema
const purchaseSchema = new Schema({
  userId: ObjectId,
  courseId: ObjectId
});

// ✅ Models (Fixed: Use mongoose.model not mongoose.Model)
const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", coursesSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports={
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}