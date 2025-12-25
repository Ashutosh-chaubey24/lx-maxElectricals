const express=require("express")
const router= express.Router()
const product=require("../models/product.js")
const Admin=require("../models/admin.js")
const user=require("../models/users")
const multer  = require('multer')
const {storage}=require("../cloudconfig.js")
const upload = multer({storage }) 
const bcrypt = require("bcrypt");
const wrapasync=require("../wrapasync.js")
const users=require("../models/users.js")
const {adminRegisterSchema, adminLoginSchema,productSchema }=require("../servervalidationadmin.js")

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    req.flash(
      "error",
      error.details.map(e => e.message).join(", ")
    );
    return res.redirect("back");
  }

  next();
};

module.exports = validate;

// 4. Admin route to view all users
router.get("/users",checkAdminAuth,wrapasync( async (req, res) => {
  const users = await user.find().sort({ createdAt: -1 });
  res.json(users);
}));
router.post("/add",validate(productSchema),upload.single('image'),checkAdminAuth,wrapasync(async(req,res)=>{
   const productdata = req.body;
  productdata.image = req.file.path;
  console.log(productdata.description); // ✅ works now
  console.log(productdata);
  const result= await new product(productdata)
  result.save()
   req.flash("success", "Product Added Successfull!");
res.redirect("/admin/allproducts")
}));
// create multiple-admin
router.get("/register", (req, res) => {
  res.render("admin/adminregister.ejs");
});

router.post("/register", validate(adminRegisterSchema),wrapasync( async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  const existing = await Admin.findOne({ username });
if (existing) {
  req.flash("error", "Username already exists!");
 return res.redirect("/admin/register"); 
}
  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ username, password: hashed });
   req.flash("success", "✅ Admin created successfully! <a href='/admin/login'>Login now</a>");
   res.redirect("/admin/dashboard"); 
}));
// Login Page
router.get("/login", (req, res) => {
  res.render("admin/adminlogin.ejs");
});

// Login Logic
router.post(
  "/login",
  validate(adminLoginSchema),
  wrapasync(async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    console.log(admin)

    if (!admin) {
      req.flash("error", "Invalid username or password!");
      return res.redirect("/admin/login");
    }

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      req.flash("error", "Invalid username or password!");
      return res.redirect("/admin/login");
    }

    // ✅ Only runs if admin exists & password correct
    req.session.adminId = admin._id;
    req.flash("success", "WELCOME ADMIN");
    res.redirect("/admin/dashboard");
  })
);

// Protect Dashboard
function checkAdminAuth(req, res, next) {
  if (!req.session.adminId) return res.redirect("/admin/login");
  next();
}

router.get("/dashboard", checkAdminAuth, async(req, res) => {
   const unreadCount = await users.countDocuments({ isRead: false });
   console.log(unreadCount)
  res.render("admin/admindashbord.ejs",{unreadCount});
});
// // show notification
// router.get("/notifications", async (req, res) => {
//   try {
//     const allNotifications = await users.find({ type: "enquiry" }).sort({ createdAt: -1 });

//     // mark all unread as read
//     await users.updateMany(
//       { isRead: false },
//       { $set: { isRead: true } }
//     );

//     res.render("admin/notification.ejs", { allNotifications });

//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error loading notifications");
//   }
// });

// // notification
// router.get("/fix-old-users", async (req, res) => {
//   await users.updateMany({}, { $set: { isRead: true } });
//   res.send("Old users marked as read");
// });

// show admin all products
router.get("/allproducts", checkAdminAuth,async(req,res)=>{
   const findproducts = await product.find().sort({ createdAt: -1 });
  res.render("admin/showallproduct.ejs",{findproducts})
})

// admin update products
router.get("/edit/:id",checkAdminAuth,wrapasync( async (req, res) => {
  const findproducts= await product.findById(req.params.id);
  res.json(findproducts);
}));



router.patch(
  "/edit/:id",
  upload.single("image"),
  validate(productSchema),
  checkAdminAuth,
  wrapasync(async (req, res) => {

    console.log("🔥 EDIT ROUTE HIT");

    let updatedData = req.body;

    if (req.file) {
      updatedData.image = req.file.path;
    }

    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });
  })
);

//checkAdminAuth,
// delete 
router.delete("/delete/:id",checkAdminAuth,wrapasync( async (req, res) => {
  try {
    let id = req.params.id;
    await product.findByIdAndDelete(id);
     res.status(200).json({ success: true, message: "Product deleted" });
res.redirect("/admin/products");
  } catch (err) {
    res.status(500)
res.redirect("/admin/products");
  }
}));
router.get("/all-users",checkAdminAuth, async (req, res) => {
  const allUsers = await users
    .find()
    .populate("productId")
    .sort({ isRead: 1, createdAt: -1 });

  res.render("admin/showallusers.ejs", { allUsers });
});

router.get("/details/:id", async (req, res) => {
  // 1️⃣ Find user by id AND mark as read
  const user = await users.findByIdAndUpdate(
    req.params.id,
    { isRead: true },       // mark as read
    { new: true }           // updated document wapas mile
  ).populate("productId");

  console.log(user);

  // 2️⃣ Render details page
  res.render("admin/userdetails.ejs", { 
    user, 
    product: user.productId 
  });
});



// delete Admin User
router.delete("/deleteadmin",checkAdminAuth,wrapasync(async(req,res)=>{
 const { username } = req.body;
    console.log("Admin Deleted Request:", username);

    const deletedAdmin = await Admin.findOneAndDelete({ username });

    if (!deletedAdmin) {
     req.flash("error", "Admin Not Found!");
      res.redirect("/admin/register")
    }

    console.log("Deleted Admin:", deletedAdmin);
    req.flash("success", "Admin Deleted successfully!");
      res.redirect("/admin/dashboard")
}));

router.get("/logout",checkAdminAuth, (req, res) => {
  req.flash("success", "Logout successfully");

  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
});






module.exports=router