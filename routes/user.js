const express=require("express")
const { model } = require("mongoose")
const router= express.Router()
const users=require("../models/users.js");
const servervalidation=require("../servervalidation.js")
const ExpressError=require("../ExpressError.js")
 



//


const validateForm = (req, res, next) => {
    const { error } = servervalidation.validate(req.body);
    if (error) {
        // error.details me Joi ka array hai
        let errmsg = error.details.map(el => el.message).join(", ");
        console.log(errmsg,"heelo mono");

        // ✅ ExpressError me statusCode number aur message string
        throw new ExpressError(errmsg, 400);
    }
    next();
};
// module.exports = setType;

// Enquiry route
router.post('/enquiry', validateForm, async (req, res, next) => {
  try {
    req.body.type = 'enquiry';
    console.log('REQ.BODY ->', req.body);
    const user = new users(req.body);
    user.isRead = false;
    await user.save();

    req.flash("success", "Your message has been sent successfully!");
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err); // 🔥 ONLY THIS
  }
});

// Contact route
router.post('/contact',validateForm, async (req, res, next) => {
  try {
    req.body.type = 'contact';
    const user = new users(req.body);
    await user.save();
     req.flash("success", "Your message has been sent successfully!");
     return res.redirect("/")
  } catch (err) {
    console.error(err);
   
    next(err); 
  }
});


module.exports = router;