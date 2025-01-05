import productmodel from "../models/productmodel.js"
import  cloudinary from 'cloudinary'
import { getdatauri } from "../utils/feature.js"
//Get all products

const file=getdatauri(req.file)
 catch(error)
 {
    console.log(error);
    res.status(500).send({
        success:false,
        message:"error in get all products api",
        error,
    });
 }
};

//getsingle product
export const getsingleproduct=async(req,res)=>{
    try{
        //get product id
        const product=await productmodel.findById(req.params.id)
        if(!product)
        {
            return res.status(404).send({
                success:false,
                message:'product not found',
            });
        }
        res.status(200).send({
            success:true,
            message:"Product found",
            product,
        });
    }
    catch(error)
 {
    console.log(error);
    //cast error|| object ID
    if(error.name==='CastError')
   return res.status(500).send( {
        success:false,
        message:"Invalid id",
    });
    res.status(500).send({
        success:false,
        message:"error in get single products api",
        error,
    });
 }
};

//Create Product
export const createproduct=async(req,res)=>{
    try{
        const{name,description,price,category,stock}=req.body
        //validate
        // if(!name || !description || !price ||!stock)
        // {
        //     return res.status(500).send({
        //         success:false,
        //         message:"Please provide all fields"
        //     });
        // }
       
        if(!req.file){
            res.status(500).send({
                success:false,
                message:"provide product image",
                error,
            });
        }
        const file=getdatauri(req.file)
        const cdb=await cloudinary.v2.uploader.upload(file.content)
        const image={
            public_id:cdb.public_id,
            url:cdb.secure_url
        }
        
        

        await productmodel.create({
            name,
            description,
            price,
            category,
            stock,
            images:[image],
        })
        res.status(201).send({
            success:true,
            message:'product created',
        });
    }
    catch(error)
 {
    console.log(error);
    res.status(500).send({
        success:false,
        message:"error in get single products api",
        error,
    });
 }
};

//update product
export const updateproductcontroller=async(req,res)=>{
    try
    {
        //find product
        const product=await productmodel.findById(req.params.id)
        //validation 
        if(!product)
        {
            return res.status(404).send({
                success:false,
                message:"Product not found"
            })
        }
        const {name,description,price,stock,category}=req.body
        //validate and update
        if(name)product.name=name
        if(description)product.description=description
        if(price)product.price=price
        if(stock)product.stock=stock
        if(category)product.category=category
        
        await product.save();
        res.status(200).send({
            success:true,
            message:"Product details update",
        });
    }
    catch(error)
    {
        console.log(error);
        //cast error || OBJECT ID
        if(error.name==='CastError')
   return res.status(500).send( {
        success:false,
        message:"Invalid id",
    });
        res.status(500).send({
            success:false,
            message:"error in get single products api",
            error,
        });
    }
};

///update product image
export const updateimgcontroller=async(req,res)=>{
    try{
        //find product
        const product=await productmodel.findById(req.params.id);
        //validation
        if(!product)
        {
            return res.status(404).send({
                success:false,
                message:'product not found'
            })
        }
        //check file
        if(!req.file)
        {
            return res.status(404).send({
                success:false,
                message:'Product image not found'
            })
        }
        const file=getdatauri(req.file)
        const cdb=await cloudinary.v2.uploader.upload(file.content)
        const image={
            public_id:cdb.public_id,
            url:cdb.secure_url
        }

        //save 
        product.images.push(image);
        await product.save();
        res.status(200).send({
            success:true,
            message:"Product image updated",
        });
    }
    catch(error)
    {
        console.log(error);
        //cast error || OBJECT ID
        if(error.name==='CastError')
   return res.status(500).send( {
        success:false,
        message:"Invalid id",
    });
        res.status(500).send({
            success:false,
            message:"error in get single products api",
            error,
        });
    }
};

export const deleteimgcontroller= async(req,res)=>{
  try{
    //find product
    const product=await productmodel.findById(req.params.id)
    //validation
    if(!product)
    {
        return res.status(404).send({
            success:false,
            message:'product not found'
        })
    }

    //image id find
    const d=req.query.id
    if(!d)
    {
        return res.status(404).send({
            success:false,
            message:"product image not found"
        });
    }
    let isexist=-1; 
    product.images.forEach((item ,index)=>{
        if(item._id.toString() === d.toString()) isexist=index;
    });
    if(isexist<0)
    {
        return res.status(404).send({
            success:false,
            message:"image Not found"
        })
    }
    //delete product image
    await cloudinary.v2.uploader.destroy(product.images[isexist].public_id);
    product.images.splice(isexist,1);
    await product.save()
    return res.status(200).send({
        success:true,
            message:"delete Product image"
    })
  } 
  catch(error)
  {
    console.log(error);
        //cast error || OBJECT ID
        if(error.name ==='CastError')
   return res.status(500).send( {
        success:false,
        message:"Invalid id",
    });
        res.status(500).send({
            success:false,
            message:"error in get delete product image api",
            error,
        });
  } 
};

//delete Product
export const deleteproductcontroller=async(req,res)=>{
    try
    {
        //find product
        const product=await productmodel.findById(req.params.id);
        if(!product)
        {
            return res.status(404).send({
                success:false,
                message:'product not found'
            })
        }
        //find and delete image cloudinary
        for(let index=0; index < product.images.length; index++)
        {
            await cloudinary.v2.uploader.destroy(product.images[index].public_id);
        }
        await product.deleteOne()
        res.status(200).send({
            success:true,
            message:"Product delete successfully"
        })
    }
    catch(error)
    {
        console.log(error);
        //cast error || OBJECT ID
        if(error.name ==='CastError')
   return res.status(500).send( {
        success:false,
        message:"Invalid id",
    });
        res.status(500).send({
            success:false,
            message:"error in get delete product api",
            error,
        });
    }
}