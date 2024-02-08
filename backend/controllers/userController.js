const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError"); // ye vha kaam aata hai jese agr createProduct me name enter krna mandatory hai aur uske diya bne submit kre toh infite waiting loop me jaayega usko detect krne k liye
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// const registerUser = catchAsyncError(async (req, res, next) => {
//   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//     folder: "avatars",
//     //width: 150,
//     width: 400,
//     // height: 450,
//     // quality: 100,
//     crop: "scale",
//   });

//   const { name, email, password } = req.body;

//   const user = await User.create({
//     name,
//     email,
//     password,
//     avatar: {
//       public_id: myCloud.public_id,
//       url: myCloud.secure_url,
//     },
//   });
//   // pehle server/js m kuch likho fir app.jss me fir yha aur images cloudinary m store hojenge hmneyha jo folder ko name diya h us name ka folder cloudinary m bnana pdega

//   // const token = user.getJWTToken();
//   // res.status(201).json({
//   //   success: true,
//   //   user,
//   //   token,
//   // });
//   sendToken(user, 201, res);
// });

const registerUser = catchAsyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    //width: 150,
    width: 400,
    height: 450,
    quality: 100,
    crop: "scale",
  });

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});

const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password"); //hmne hmare model me select :false kiya tha password me jisse pasword na dikhe selection ke time toh hum allg se likh rhe hai +password to get password

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  // console.log(isPasswordMatched); //we have created a method of it in userModel but its not working thatss why i have done it inline
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  // const token = user.getJWTToken();
  // res.status(200).json({
  //   success: true,
  //   user,
  //   token,
  // });
  sendToken(user, 200, res); // this is the replacement of above commented code
});

const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404)); //if given email doesnt exist in database u cant reset
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false }); //resetPasswordToken ,resetPasswordExpire have been updated in getResetInformation toh unko database me update krna hoga isliye uesr ko fir se save kiya hai
  // console.log("user found: sending mail...");

  // const resetPasswordUrl = `http://localhost:3000/password/reset/${resetToken}`; //req.protocol=http || https , req.get( "host")=localhost/server name
  // const resetPasswordUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/password/reset/${resetToken}`; //req.protocol=http || https , req.get( "host")=localhost/server name

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    // sendemail is a function developed to send emails
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    // if an error occurs we have to reset the changes we had made earlier toh uske liye we are making them undefined and saving them again
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // humne forgotpassword jab kiya toh hmne resetToken bnaya aur uska hash resetPasswordToken me store kiya database me . Ab jab humpe resetlink aaya usme hum resettoken as a para. bhej rhe hai. Ab hum us parameter ko leke firse hash krrhe hai and we are seeing if we can finnd the same hash in databse. If yes then yes u can change the password

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // jabb hum reset ka link bhej rhe hai we are also defininf the time until which we are allowe to reset the paswwrod . Toh jab hum link pe click krte hai pehle hum resethash check krte hai fir hum chekc krte hai ki hmara password change krne ka time khtm toh nhi hua hai
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get User Detail
const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});
// both update funtions down are accesible by a logged in user so req.id is known to us cause user is logged in
const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword); // kya entered password matches the previous one

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//UPDATE USER PROFILE
const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  //CLOUDINARY

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      //width: 150,
      width: 400,
      height: 450,
      quality: 100,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all user (admin)
const getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
const getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
const updateUserRole = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id); // we cant use req.user.id because admin itself might me deleted then

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
};
