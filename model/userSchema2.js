const mongoose=require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')


const userSchema= new mongoose.Schema({
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
    rating: {
        type: Number,
        required: true
    },
    scrap: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    tokens:[
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
 
})



//Hashing the password
userSchema.pre('save', async function (next){
         if(this.isModified('password')){
            this.password = await bcrypt.hash(this.password, 12);
            this.cpassword = await bcrypt.hash(this.cpassword, 12);
        }
        next();
});

//Generating Token
userSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(err){
        console.log(err);
    }
}



//exporting Schema to auth.js

const User2 = mongoose.model('EMPLOYEE', userSchema);

module.exports = User2;