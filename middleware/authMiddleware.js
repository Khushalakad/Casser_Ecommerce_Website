import JWT from 'jsonwebtoken'
import usermodel from '../models/usermodel.js';
 

//protected routes through json web token
export const requireSignin=async (req,res,next)=>{
    try {
        const decode=JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
        req.user=decode;
        next();
    } catch (error) {
        console.log(error);
        // return res.status(401).json({message:"Unauthorized access"})

    }
    
}
//admin access
export const isAdmin=async (req,res,next)=>{
    try {
        const user=await usermodel.findById(req.user._id);
        if(user.role!==1){
            return res.status(403).send({
                message:"You are not authorized to access this route",
                success:false
            })
        }
        else{
            next();
        }
    } catch (error) {
        res.status(401).send({
            message:"error in admin middleware",
            error,
            success:false
        })
    }
}