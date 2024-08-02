import { comparePassword, hashpassword } from "../helper/authhelper.js";
import usermodel from "../models/usermodel.js";
import ordermodel from "../models/ordermodel.js";
import JWT from "jsonwebtoken";
//registration controller
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address,answer } = req.body;
    //validation
    if (!name) {
      res.send({ message: "name is required" });
    }
    if (!email) {
      res.send({ message: "email is required" });
    }
    if (!password) {
      res.send({ message: "password is required" });
    }
    if (!phone) {
      res.send({ message: "phone is required" });
    }
    if(!answer){
      res.send({message:"answer is required"})
    }
    if (!address) {
      res.send({ message: "address is required" });
    }
    //check user
    const existinguser = await usermodel.findOne({ email });
    //existing user
    if (existinguser) {
      return res.status(200).send({
        success: false,
        message: "user already registerd",
      });
    }
    //register user
    const hashedpassword = await hashpassword(password);
    //save
    const user = new usermodel({
      name,
      email,
      phone,
      password: hashedpassword,
      address,
      answer
    }).save();
    res
      .status(201)
      .send({ success: true, message: "user register successfully", user });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in register the user",
      error,
    });
  }
};
//login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(200).send({
        success: false,
        message: "email or password is incorrect",
      });
    }
    //check user
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "email is not registered",
      });
    }
    const matchpass = await comparePassword(password, user.password);
    if (!matchpass) {
      return res.status(200).send({
        success: false,
        message: "Invailid password",
      });
    }
    //token by jwt
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "70d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role:user.role
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: true,
      message: "Error in login",
      error,
    });
  }
};
//for forgot password
export const forgotpasswordController = async (req, res) => {
  try {
    const { email, newpassword, answer } = req.body;
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "email is required",
      });
    }
    if (!newpassword) {
      return res.status(400).send({
        success: false,
        message: "new password is required",
      });
    }
    if (!answer) {
      return res.status(400).send({
        success: false,
        message: "answer is required",
      });
    }
    //check
    const user = await usermodel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "user not found",
      });
    }
    //update password
    const hashed=await hashpassword(newpassword);
    await usermodel.findByIdAndUpdate(
        user._id,{password:hashed}
    )
    res.status(200).send({
        success: true,
        message: "password updated successfully",
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in forgot password",
      error,
    });
  }
};
//test controller
export const testController = async (req, res) => {
  res.send("Protected Controller");
};
//update user/profile
export const updateProfileController = async (req, res) => {
  try {
    const {name,email,password,address,phone}=req.body;
    
    const user = await usermodel.findById(req.user._id);
    
    if(password && password.length<6){
         return res.json({
          // success:false,
          message:"password is required and must be 6 characters long"

         })
    }
    console.log(user.name);
    const hashedpassword=password? await hashpassword( password):undefined;

    const updateduser=await usermodel.findByIdAndUpdate(req.user._id,{
      name:name||user.name,
      // email:email||user.email,
      password:hashedpassword||user.password,
      address:address||user.address,
      phone:phone||user.phone
    },{new:true})
    res.status(200).send({success:true,message:"user updated successfully",updateduser})
    if(!user) return res.status(400).send({success:false,message:"user not found"})
     
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update profile",
      error,
      });
  }
}
//showing orders in user dashboard
export const getOrdersController = async (req, res) => {
  try {
    const orders=await ordermodel.find({buyer:req.user._id}).populate("products","-image").populate("buyer","name")
    res.json(orders)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get orders",
      error,  
      });
  }
}
export const getAllOrdersController=async(req,res)=>{
  try {
    const orders=await ordermodel.find({}).populate("products","-image").populate("buyer","name").sort({ createdAt: "desc" })
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get orders",
      error,  
      });
  }
}
//order update by admin
export const updateOrderStatusController=async(req,res)=>{
  try {
    const {orderId}=req.params;
    const {status}=req.body;
    const {orders}=await ordermodel.findByIdAndUpdate(orderId,{status},{new:true})
    res.status(200).send({success:true,message:"order updated successfully",orders})
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update order status",
      error,
      });
  }
}
export default registerController;
  