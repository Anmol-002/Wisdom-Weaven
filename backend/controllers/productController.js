const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError"); // ye vha kaam aata hai jese agr createProduct me name enter krna mandatory hai aur uske diya bne submit kre toh infite waiting loop me jaayega usko detect krne k liye
const ApiFeatures = require("../utils/apifeature");
const cloudinary = require("cloudinary");

// create product --admin
const createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  // req.body.user = req.user.id;

  req.body.user = req.user.id; //hmne ye kia hai ki jab koi nya login krta hai ya new user hai uski ek id assign hoti hai. Ab agr voh bnda koi product issue krta hai toh hum us product ko user ki id de rhe hai jis se hme pta lag je konsaproduct konse user ne daala hai
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//UPLOAD IMAGE
const uploadImages = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  res.status(201).json({
    success: true,
    imagesLinks,
  });
});

//get products
const getAllProducts = catchAsyncError(async (req, res, next) => {
  // return next(new ErrorHandler("Product not found", 500)); used to check the alert error function created in the frontend in the home.js file
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments(); //kitne products hai humpe

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  // ya toh seedha Product.find() kro sare element aajenge hum agr search paar me dalte hai kuch toh voh hmare keyword me aayega aut fir hum sirf us keyword
  // ko dekhege toh uske liye search function bnaya hai apiFeature ke ander jha query hmari PRoduct.find() hai aur query value apiFeature me jaake query.keyword hai jo keyword=*** *hoti hai
  let products = await apiFeature.query;

  let filteredProductsCount = products.length;
  // console.log(filteredProductsCount);

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query;
  res.status(201).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// GET ALL PRODUCT -- ADMIN
const getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// update --admin
const updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  // if (!product) {
  //   return res.status(500).json({
  //     success: false,
  //     message: "Product not found",
  //   });
  // }
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images?.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//get single product details
const getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// delete product
const deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  // if (!product) {
  //   return res.status(500).json({
  //     success: false,
  //     message: "Product not found",
  //   });
  // }
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  //DELETE IMAGE FROM CLOUDINARY
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product removed successfully",
  });
});

// Create New Review or Update the review
const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id, //id of the user who is currently logged in
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString() // sare previous reviews me traverse krenge aur dekhenge ki agr koi previous review ki user id current user se match krti hai agr hai esa toh purana vala review update krke ye vala daal denge
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
const getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id); // here id repersent the id of product jiske review dhoondne hai

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
const deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId); // productid was used to find the product of which review is beinng deleted

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString() // normal id repersent id of the review
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

//agr hum data dete hai body ke ander toh hum req.body likhte hai. Agr hum url me ?ke bad dete hai use query kehte hai aur use req.query.id/ jo bhi hia vese likhte hai aur agr sird id likhte hai kiis product in url /router me toh use req.paras.id likhte hai

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
  uploadImages,
};
