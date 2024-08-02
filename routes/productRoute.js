import express from 'express'
import { isAdmin, requireSignin } from '../middleware/authMiddleware.js';
import { brainTreePaymentController, brainTreeTokenController, createProductController, deleteProductController, filterProductController, getAllProductsController, getPhotoController, getSingleProductController, productCategoryController, productCountController, productListController, searchProductController, similarProductController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';
const router=express.Router();
//routes
//create product routes
router.post('/create-product',requireSignin,isAdmin,formidable(),createProductController )

//get all product route
router.get('/get-products',getAllProductsController )  
//get single product route
router.get('/get-products/:slug',getSingleProductController)
//get photo route
router.get('/get-image/:pid',getPhotoController)   
//delete product
router.delete('/delete-product/:pid',deleteProductController)
//update product
router.put('/update-product/:pid',requireSignin,isAdmin,formidable(),updateProductController )
//filter product
router.post('/filter-products',filterProductController )
//product count
router.get('/product-count',productCountController )
//product per page
router.get('/product-list/:page',productListController )
//search product
router.get('/search/:keyword',searchProductController )
//similar product controller
router.get('/related-product/:pid/:cid',similarProductController)
//to get product according to category
router.get('/product-category/:slug',productCategoryController)
//payment gateway route for token
router.get('/braintree/token' ,brainTreeTokenController)
// Payments
router.post('/braintree/payment' ,requireSignin,brainTreePaymentController)
export default router;