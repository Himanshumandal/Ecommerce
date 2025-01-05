import  { usermodel } from '../models/usermodel.js'
import cloudinary from 'cloudinary'
import { getdatauri } from '../utils/feature.js'


export const registercontroller=async(req,res)=>{
     try{
        const {name,email,password,address,city,country,phone}=req.body
        //validation
        if(!name || !password || !city || !address || !country||!phone)
        {
            return res.status(500).send({
                success:false,
                message:"Please provide all fields",
            }); 
        }
        //check existing user
        const existinguser=await usermodel.findOne({email})
        //validation
        if(existinguser)
        {
            return res.status(500).send({
                success:false,
                message:"email already taken",
            });
        }
        const user=await usermodel.create({
            name,
            email,
            password,
            address,
            city,
            country,
            phone,

        });
        res.status(201).send({
            success:true,
            message:'Registeration success,please login',
            user

        });
     }
     catch(error)
     {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in register API',
            error
        })
     }
};

//Login
export const logincontroller=async(req,res)=>{
    try{
        const {email,password}=req.body 
        //validation
        if(!email || !password){
            return res.status(500).send({
                success:false,
                message:'please add email or password'
            })
        }
        //check user 
        const user=await usermodel.findOne({email});
        //user validation
        if(!user)
        {
            return res.status(404).send({
                success:false,
                message:'user not found'
            });
        }
        //check password
        const ismatch=await user.comparepassword(password)
        //validation password
        if(!ismatch)
        {
            return res.status(500).send({
                success:false,
                message:'invalid password'
            });
        }

        //.cookie("token",token).
        const token=user.generatetoken();
        res.status(200).cookie("token",token,{
            expires:new Date(Date.now()+15*24*60*60*1000),
            secure:process.env.node_env==="development"? true:false,
            httpOnly:process.env.node_env==="development"? true:false
        }).send({
            success:true,
            message:"Login Successfully",
            token,
            user,
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:"false",
            message:"Error in Login Api",
            error
        });
    }
};

//get user profile
 
export const userprofile=async(req,res)=>{
    try{
        const user=await usermodel.findById(req.user._id);
        user.password=undefined;
        res.status(200).send({
            success:true,
            message:'User Profile fetched successfully',
            user,
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error in profile api',
            error
        });
    }

};


//Logout

export const userlogout=async(req,res)=>{
    try{
        res.status(200).cookie("token","",{
            // +15*24*60*60*1000
            expires:new Date(Date.now()),
            secure:process.env.node_env==="development"? true:false,
            httpOnly:process.env.node_env==="development"? true:false
        }).send({
            success:true,
            message:"Logout Successfully",
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error in logout api',
            error,
        });
    }
};

//Update Profile

export const updateprofile=async(req,res)=>{
    try
    {
        const user= await usermodel.findById(req.user._id)
        const {name,email,address,city,country,phone}=req.body;
        if(name) user.name=name
        if(email) user.email=email
        if(address) user.address=address
        if(city) user.city=city
        if(country) user.country=country
        if(phone) user.phone=phone
        
        //save user
        await user.save();
        res.status(200).send({
            success:true,
            message:"User Profile updated",
           
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error in updateprofile api',
            error,
        });
    }
};

export const updatepassword=async(req,res)=>{
    try
    {
        const user=await usermodel.findById(req.user._id)
        const {oldpassword,newpassword}=req.body
        if(!oldpassword || !newpassword)
        {
            return res.status(500).send({
                success:false,
                message:'please provide old or new password'
            });
        }
        //old pass check
        const ismatch=await user.comparepassword(oldpassword)
        //validation
        if(!ismatch)
        {
            return res.status(500).send({
                success:false,
                message:'Invalid old password'
            });
        }
        user.password=newpassword
        await user.save()
        res.status(200).send({
            success:true,
            message:"User Password updated",
           
        });

    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error in update-password api',
            error,
        });
    }
};


//Update Profile Pic

export const updateprofilpic=async(req,res)=>{
    try{
        const user=await usermodel.findById(req.user._id)
        //file get from user or client photo
        const file=getdatauri(req.file)
        //delete previous image
        await cloudinary.v2.uploader.destroy(user.profilepic.public_id)
        //update
        const cdb=await cloudinary.v2.uploader.upload(file.content)
        user.profilepic={
            public_id:cdb.public_id,
            url:cdb.secure_url,
        };

        //save func
        await user.save()
        res.status(200).send({
            success:true,
            message:'profile picture update',
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error in update-profil-pic api',
            error,
        });
    }

};
