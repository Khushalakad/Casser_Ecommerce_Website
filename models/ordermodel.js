import mongoose, { mongo } from "mongoose";
import slugify from "slugify";

const OrderSchema=new mongoose.Schema({
    products: [{
        type: mongoose.ObjectId,
        ref: "Products"
    }],
    payments:{},
    buyer:{
        type: mongoose.ObjectId,
        ref: "users"
    },
    status:{
        type:String,
        enum:["pending","processing","shipped","delivered","return","canceled"],
        default:"pending"
    },
},{timestamps:true})
export default mongoose.model('Order',OrderSchema) 