class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
// hum baar baar likhte hai if(!found)
// res.status(500).json({ success:false,message:"abjbj"})
//isko avoid krne ke liye we developed an error class which inherits from
// built in error class . Ye directly nhi chlta iske liye middleware bnana
// pdta hai jo humne error name se bnaya hai middleware folder me then import in app.js

module.exports = ErrorHandler;
