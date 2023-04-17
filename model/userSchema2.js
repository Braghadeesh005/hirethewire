//Employee Image schema


const mongoose=require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
},
email: {
    type: String,
    required: true
},
phone: {
    type: Number,
    required: true
},
work: {
    type: String,
    required: true
},
password: {
    type: String,
    required: true
},
cpassword: {
    type: String, 
    required: true
},
scrap: {
    type: Number,
    required: true
},
filename: { 
    type: String, 
    required: true, 
    unique: true 
},
originalName: { 
    type: String, 
    required: true 
},
path: { 
    type: String, 
    required: true 
},
created: { 
    type: Date, 
    default: Date.now 
},
tokens:[
    {
        token: {
            type: String,
            required: true
        }
    }
],

});


//Hashing the password
UserSchema.pre('save', async function (next){
  if(this.isModified('password')){
     this.password = await bcrypt.hash(this.password, 12);
     this.cpassword = await bcrypt.hash(this.cpassword, 12);
 }
 next();
});

//Generating Token
UserSchema.methods.generateAuthToken = async function(){
try{
 let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
 this.tokens = this.tokens.concat({token:token});
 await this.save();
 return token;
}catch(err){
 console.log(err);
}
}

const User2 = mongoose.model('EMPLOYEE', UserSchema);

module.exports = User2;