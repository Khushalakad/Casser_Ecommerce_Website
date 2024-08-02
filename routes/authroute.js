import express from 'express'
import registerController, { forgotpasswordController, getAllOrdersController, getOrdersController, loginController,  testController, updateOrderStatusController, updateProfileController } from '../controllers/authcontroller.js';
import { isAdmin, requireSignin } from '../middleware/authMiddleware.js';

//router object
const router=express.Router()
//routing
//for registre method post
router.post('/register',registerController)
//for login post
router.post('/login',loginController)
//for forgot password
router.post('/forgot-password',forgotpasswordController)
//test route
router.get('/test',requireSignin,isAdmin, testController);
//protected route for user
router.get('/user-auth',requireSignin ,(req,res)=>{
    res.status(200).send({ok:true})
})
//protected route for Admin
router.get('/admin-auth' ,requireSignin,isAdmin,  (req,res)=>{
    res.status(200).send({ok:true})
})
//update profile
router.put('/profile',requireSignin,updateProfileController);
//order details
router.get('/orders',requireSignin, getOrdersController)
//admin all  orders 
router.get('/all-orders',requireSignin,isAdmin, getAllOrdersController);
//order update by admin
router.put('/order-status/:orderId',requireSignin,isAdmin,updateOrderStatusController)
export default router;