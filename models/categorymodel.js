import mongoose from "mongoose";

const categoryschema=new mongoose.Schema({
    category:{
        type:String,
        required:[true,'category is required']
    },
    
},{timestamps:true}
);

export const categorymodel=mongoose.model("Category",categoryschema);
export default categorymodel;