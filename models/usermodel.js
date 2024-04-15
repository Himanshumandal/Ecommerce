import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:[true,'email already taken']
    },
    password:{
        type:String,
        required:[true,'password is required'],
        minLength:[6,'password length should be greater than 6 character']
    },
    address:{
        type:String,
        required:[true,'address is required']
    },
    city:{
        type:String,
        required:[true,'city name is required']
    },
    country:{
        type:String,
        required:[true,'country name is required']
    },
    phone:{
        type:String,
        required:[true,'phone no is required']
    },
    profilepic:{
       public_id:{
        type:String,
       },
       url:{
        type:String,
       },
    },
    role:{
        type:String,
        default:"user",
    }
},{timestamps:true});

//functions
//hash func
userschema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
});

//compare function
userschema.methods.comparepassword=async function(plainpass)
{
    return await bcrypt.compare(plainpass,this.password); 
};


//jwt token
userschema.methods.generatetoken=function(){
    return jwt.sign({_id:this._id},process.env.jwt_secret,{expiresIn:'7d',
 });
};

export const usermodel=mongoose.model("Users",userschema);

export default usermodel;