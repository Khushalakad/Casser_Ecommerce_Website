import slugify from "slugify";
import categorymodel from "../models/categorymodel.js";
//create category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Please provide a name for the category." });
    }
    const existingCategory = await categorymodel.findOne({ name });
    if (existingCategory) {
      return res
        .status(200)
        .send({ message: "Category already exists.", success: true });
    }
    const category = await new categorymodel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      message: "Category created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};
// update category
export const updateCategoryController = async (req, res) => {
      try {
        const {name}=req.body;
        const {id}=req.params
        const category= await categorymodel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
          message: "Category updated successfully.",
          success: true,
          category
        })
      } catch (error) {
        console.log(error);
        res.status(500).send({
          message:'error while update category',
          success:false,
          error
        })
      }
}
//get all category
export const getAllCategoryController=async(req,res)=>{
   try {
      const allcategory=await categorymodel.find({}); 
      res.status(200).send({
        message: "Category fetched successfully.",
        success: true,
        allcategory
      })
   } catch (error) {
    console.log(error);
    res.status(500).send({
      message:'error in get all category',
      success:false,
      errror
    })
   }
}
//get one category
export const getSingleCategoryController=async(req,res)=>{
  try {
    const category=await categorymodel.findOne({slug:req.params.slug})
    res.status(200).send({
      message: "Single Category fetched successfully.",
      success: true,
      category
      })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message:'error while fetch single category',
      success:false,
    })
  }
}
//delete category
export const deleteCategoryControler=async(req,res)=>{
  try {
    const {id}=req.params
    await categorymodel.findByIdAndDelete(id)
    res.status(200).send({
      message:'category deleted successfully',
      success:true
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message:'error while delete category',
      success:false,
      })
  }
}