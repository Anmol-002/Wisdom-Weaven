const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  deleteReview,
  getProductReviews,
  getAdminProducts,
  uploadImages,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");
// isauthenticated user ye dekh rha hai ki bnda logged in hai ya nhi ya uski cookie active hai ya nhi , authorized role ye check kr rha ki voh given request access kr skta hai ya nhi uskke role ke hisab se uspe permissions hai ya nhi
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUser,  authorizedRoles("admin"),createProduct);

router
  .route("/admin/upload")
  .post(isAuthenticatedUser, authorizedRoles("admin"), uploadImages);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, updateProduct)
  .delete(isAuthenticatedUser, deleteProduct);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAdminProducts);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
