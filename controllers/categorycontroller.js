import categorymodel from '../models/categorymodel.js';
import productmodel from '../models/productmodel.js';

//create cat
export const createcategory=async(req,res)=>{
    try {
        const {category}=req.body
        //validation
        if(!category)
        {
            return res.status(404).send({
                success:false,
                message:"Please Provide category name",
            });
        }
        await categorymodel.create({category})
        res.status(201).send({
            success:true,
            message:`${category}category created successfully`,
        });
    }
    catch(error)
    {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in Create category api",
            error,
        });
    }
};

//Get all category
export const getallcategory=async(req,res)=>{
     try{
        const categories=await categorymodel.find({});
        res.status(200).send({
            success:true,
            message:"categories fetch successfully",
            totalcat:categories.length,
            categories,
        });
     }
     catch(error)
     {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in Get all category api",
            error,
        });
     }
};

///Delete Category 
export const deletecategory=async(req,res)=>{
    try{
        //find category
        const category=await categorymodel.findById(req.params.id)
        //validation
        if(!category)
        {
            return res.status(404).send({
                success:false,
                message:'category not found'
            });
        }
        //find product with this category id
        const products=await productmodel.find({category:category._id});
        //update product category
        for(let i=0; i<products.length; i++)
        {
            const product =products[i]
            product.category=req.body;
            await product.save();
        }
        await category.deleteOne();

        res.status(200).send({
            success:true,
            message:"category is deleted successfully",
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
            message:"error in delete category api",
            error,
        });
    }
};


//Update category
export const updatecategory=async(req,res)=>{
    try{
        //find category
        const category=await categorymodel.findById(req.params.id)
        //validation
        if(!category)
        {
            return res.status(404).send({
                success:false,
                message:'category not found'
            });
        }
        //get new cat
        const {updatedcategory}=req.body
        //find product with this category id
        const products=await productmodel.find({category:category._id});
        //update product category
        for(let i=0; i<products.length; i++)
        {
            const product =products[i]
            product.category=updatedcategory
            await product.save();
        }

        if(updatedcategory) category.category=updatedcategory;

        await category.save();

        res.status(200).send({
            success:true,
            message:"category is update successfully",
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
            message:"error in update category api",
            error,
        });
    }
}