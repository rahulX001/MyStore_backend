
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  number:{
    type:Number,
    required:true,
    unique:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  Password:{
    type:String,
    required:true, 
  }
})
userSchema.pre('save',async function(next)
{
  if(!this.isModified())return next();
  const salt=await bcrypt.genSalt(10);
  this.Password=await bcrypt.hash(this.Password,salt);
  next();
}) 
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.Password);
}; 
const User=mongoose.model('User',userSchema);

module.exports = User;
