import slugify from "slugify";
import productmodel from "../models/productmodel.js";
import categoryModel from "../models/categorymodel.js";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";
import ordermodel from "../models/ordermodel.js";
dotenv.config();
//payment gateways
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
//create product
export const createProductController = async (req, res) => {
  try {
    const { name, price, description, category, quantity } = req.fields;

    const { image } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ message: "name is required!" });
      case !price:
        return res.status(500).send({ message: "price is required!" });
      case !description:
        return res.status(500).send({ message: "description is required!" });
      case !category:
        return res.status(500).send({ message: "category is required!" });
      case !quantity:
        return res.status(500).send({ message: "quantity is required!" });

      case image && image.size > 1000000:
        return res
          .status(500)
          .send({ message: "image is required and less then 1MB!" });
    }
    const products = new productmodel({ ...req.fields, slug: slugify(name) });
    if (image) {
      products.image.data = fs.readFileSync(image.path);
      products.image.contentType = image.type;
    }
    await products.save();
    res
      .status(200)
      .send({ message: "product created successfully!", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in product creation",
      success: false,
      error: error.message,
    });
  }
};
//get all products
export const getAllProductsController = async (req, res) => {
  try {
    const products = await productmodel
      .find({})
      .select("-image")
      .limit(15)
      .sort({ createdAt: -1 })
      .populate("category");
    res
      .status(200)
      .send({
        message: "all products fetch successful",
        total_products: products.length,
        products,
        success: true,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in getting all products",
      success: false,
    });
  }
};
//get single products
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productmodel
      .findOne({ slug: req.params.slug })
      .select("-image")
      .populate("category");
    res.status(201).send({
      message: "single product fetch successful",
      product,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in getting single product",
      success: false,
      error,
    });
  }
};
//get photo controller
export const getPhotoController = async (req, res) => {
  try {
    const productphoto = await productmodel
      .findById(req.params.pid)
      .select("image");
    if (productphoto.image.data) {
      res.set("Content-type", productphoto.image.contentType);
      return res.status(201).send(productphoto.image.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in getting photo",
      success: false,
      error,
    });
  }
};
//delete product controller
export const deleteProductController = async (req, res) => {
  try {
    const { pid } = req.params;
    await productmodel.findByIdAndDelete(pid);
    res.status(201).send({
      message: "product deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in deleting product",
      success: false,
      error,
    });
  }
};
//update product controller
export const updateProductController = async (req, res) => {
  try {
    const { name, price, description, category, quantity, shipping } =
      req.fields;

    const { image } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ message: "name is required!" });
      case !price:
        return res.status(500).send({ message: "price is required!" });
      case !description:
        return res.status(500).send({ message: "description is required!" });
      case !category:
        return res.status(500).send({ message: "category is required!" });
      case !quantity:
        return res.status(500).send({ message: "quantity is required!" });

      case image && image.size > 1000000:
        return res
          .status(500)
          .send({ message: "image is required and less then 1MB!" });
    }
    const products = await productmodel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (image) {
      products.image.data = fs.readFileSync(image.path);
      products.image.contentType = image.type;
    }
    await products.save();
    res
      .status(200)
      .send({ message: "product updated successfully!", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in product updation",
      success: false,
      error: error.message,
    });
  }
};
//filter product controller
export const filterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productmodel.find(args);
    res.status(200).send({
      message: "products fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(501).send({
      message: "error in product filteration",
      success: false,
      error,
    });
  }
};
//count product
export const productCountController = async (req, res) => {
  try {
    const total = await productmodel.find({}).estimatedDocumentCount();
    res.status(201).send({
      message: "product count fetched successfully",
      success: true,
      total,
    });
    // console.log(total);
  } catch (error) {
    console.log(error);
    res.status(501).send({
      message: "error in product count",
      success: false,
    });
  }
};
//product list
export const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const products = await productmodel
      .find({})
      .select("-image")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      message: "products fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(501).send({
      message: "error in product list",
      success: false,
      error,
    });
  }
};
//search product controller
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productmodel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } }, //here options :"i" is use for case insensitive
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-image");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in search product",
      success: false,
      error,
    });
  }
};
//similar products or related products
export const similarProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productmodel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(8)
      .populate("category");
    res.status(200).send({
      message: "similar products fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in similar product",
      success: false,
      error,
    });
  }
};
//product category controller
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const product = await productmodel.find({ category }).populate("category");
    res.status(200).send({
      message: "product category fetched successfully",
      success: true,
      product,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in product category",
      success: false,
      error,
    });
  }
};
//payment gateway controllers
//payment token
export const brainTreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        console.log(err);
        res.status(500).send({
          message: "error in payment token",
          success: false,
        });
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in payment token",
      success: false,
      error,
    });
  }
};
//for payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        //paymentMethodNonce: "fake-valid-nonce",
        options: {
          submitForSettlement: true,
        },
      },
      function (err, result) {
        if (result) {
          const order = new ordermodel({
            products: cart,
            payments: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send({
            message: "error in payment token",
            success: false,
            err,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in payment gateway",
      success: false,
      error,
    });
  }
};
