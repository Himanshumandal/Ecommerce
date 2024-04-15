import mongoose from "mongoose";

const orderschema=new mongoose.Schema(
    {
        shippinginfo:{
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
            }
        },
        orderitems:[
            {
                name:{
                    type:String,
                    required:[true,'provide name is required']
                },
                price:{
                    type:Number,
                    required:[true,'product price is required']
                },
                stock:{
                    type:Number,
                    required:[true,'product stock is required']
                },
                quantity:{
                    type:Number,
                    required:[true,'product quantity is required']
                },
                image:{
                    type:String,
                    required:[true,'product image is required']
                },
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Products',
                    required:[true,"Products is required"]
                }
            }
        ], 
        paymentmethod:{
            type:String,
            enum:["cod","online"],
            default:"cod"
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Users',
            required:[true,"user id is required"]
        },
        paidat:Date,
        productpaymentinfo:
        {
            id:String,
            status:String
        },
        itemprice:
        {
            type:Number,
            required:[true,'item price is require']
        },
        tax:
        {
            type:Number,
            required:[true,'tax price is require']
        },
        shippingcharges:
        {
            type:Number,
            required:[true,'shipping charges is require']
        },
        totalamount:
        {
            type:Number,
            required:[true,'item totalamount is require']
        },
        orderstatus:
        {
            type:String,
            enum:['processing','shipped','delivered'],
            default:'processing'
        },
        deliveredat:Date
    },{timestamps:true}
);

export const ordermodel=mongoose.model("Order",orderschema);
export default ordermodel;