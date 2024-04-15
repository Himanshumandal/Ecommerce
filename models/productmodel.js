import mongoose, { Schema } from "mongoose";

const productschema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'product name is required']
    },
    description:{
        type:String,
        required:[true,'product description is required']
    },
    price:{
        type:Number,
        required:[true,'product price is required']
    },
    stock:{
        type:Number,
        required:[true,'product stock is required']
    },
    // quantity:{
    //     type:Number,
    //     required:[true,'product quantity is required']
    // },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    images:[{
        public_id:String,
        url:String
    }]
},{timestamps:true}
);

export const productmodel=mongoose.model("Products",productschema);
export default productmodel;