import express from 'express'
import { isAdmin, requireSignin } from '../middleware/authMiddleware.js';
import { createCategoryController, deleteCategoryControler, getAllCategoryController, getSingleCategoryController, updateCategoryController } from '../controllers/categoryController.js';

const router=express.Router();

//routes
//create category
router.post('/create-category',[requireSignin,isAdmin ], createCategoryController)
//update category
router.put('/update-category/:id',requireSignin,isAdmin,updateCategoryController)
//get all category
router.get('/all-category',getAllCategoryController)
//single category
router.get('/single-category/:slug',getSingleCategoryController)
//delete category
router.delete('/delete-category/:id',requireSignin,isAdmin,deleteCategoryControler)
export default router;