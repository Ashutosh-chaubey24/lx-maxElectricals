if(process.env.NODE_ENV !="production"){
require("dotenv").config()
}
const express = require("express");
const app = express();
// const helmet = require("helmet");
// app.use(
//   helmet.contentSecurityPolicy({
//     useDefaults: true,
//     directives: {
//       defaultSrc: ["'self'"],
//       imgSrc: [
//   "'self'",
//   "data:",
//   "https://res.cloudinary.com/de9agjv9o/",
//   "https://cdn.jsdelivr.net",
//   "https://unpkg.com",
//   "https://cdnjs.cloudflare.com",
//   "https://a.tile.openstreetmap.org" , // Leaflet tiles allow
//    // ✅ OpenStreetMap tiles (IMPORTANT)
//   "https://a.tile.openstreetmap.org",
//   "https://b.tile.openstreetmap.org",
//   "https://c.tile.openstreetmap.org"
// ],
//       scriptSrc: [
//         "'self'",
//         "'unsafe-inline'",
//         "https://cdn.jsdelivr.net",
//         "https://unpkg.com"
//       ],
//       styleSrc: [
//         "'self'",
//         "'unsafe-inline'",
//         "https://fonts.googleapis.com",
//         "https://cdn.jsdelivr.net",
//         "https://unpkg.com",
//         "https://cdnjs.cloudflare.com"
//       ],
//       fontSrc: [
//         "'self'",
//         "https://fonts.gstatic.com",
//         "https://cdnjs.cloudflare.com"
//       ],
//       connectSrc: [
//         "'self'",
//         "https://cdn.jsdelivr.net",
//         "https://unpkg.com"
//       ],
//       frameAncestors: ["'self'"]
//     }
//   })
// );

const flash = require("connect-flash");
app.set("view engine","ejs")
const path = require("path");
app.set("views", path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
const ExpressError=require("./ExpressError.js")
const wrapasync=require("./wrapasync.js")
const ejsmate = require('ejs-mate');
app.engine("ejs",ejsmate)
const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); 
// app.use(expressLayouts);
const mongoose = require("mongoose");
const admin=require("./routes/admin.js")
const homeindex=require("./routes/product.js")
const UserRoute=require("./routes/user.js")
// const cors = require("cors");
const user=require("./models/users")
const product=require("./models/product")
const allUsers=require("./models/users.js")
const Admin=require("./models/admin.js")
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const bcrypt = require("bcrypt");
app.use(express.urlencoded({extended:true}))
app.use(express.json());
const multer  = require('multer')
const {storage}=require("./cloudconfig.js")
const upload = multer({storage })                                           
const MONGO_URL=process.env.MONGO_URL

// 1. Connect to MongoDB
mongoose
  .connect(MONGO_URL,
     {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

const store= MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      crypto:{
        secret: process.env.SESSION_SECRET,
      },touchAfter:24*3600
    });
app.use(
  session({
    store:store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
  secure: false,
   sameSite: "lax"  
    }
  })
);
store.on("error",()=>{
  console.log("error in mongo session  stote",err)
})
app.use(flash());
app.use(async(req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
     res.locals.totalProducts = await product.countDocuments();
      res.locals.allUser = await allUsers.countDocuments();
       res.locals.unreadCounts = await allUsers.countDocuments({ isRead: false });
       res.locals.alladmin=await Admin.countDocuments()
    next();
});
app.get("/flash-test", (req, res) => {
  req.flash("success", "FLASH WORKING TEST ✅");
  res.redirect("/");
});
const setType = (req, res, next) => {
    if (req.originalUrl.startsWith("/user/contact")) {
        req.body.type = "contact";
    }

    if (req.originalUrl.startsWith("/user/enquiry")) {
        req.body.type = "enquiry";
    }
    next();
};
app.use(setType)
app.use("/admin",admin); // Admin 
app.use("/",homeindex); // home index
app.use("/user",UserRoute); // home index
// 5. Start serverk

// after all app.use(...) routes
app.use((req, res, next) => {
  next(new ExpressError("Page not found", 404));
});
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  err.status = status;
console.log(status,"hello")
console.log(err.message)
// console.log(err)
res.render("product/error.ejs", { err });
});
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
