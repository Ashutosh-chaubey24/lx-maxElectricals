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
        let errmsg = error.details.map(el => el.message).join(",");
        console.log(errmsg)
        throw new ExpressError(400, errmsg);
    }
    next();
};
// module.exports = setType;

// Enquiry route
router.post('/enquiry',validateForm, async (req, res, next) => {
  try {
    // ensure type set to allowed value
    req.body.type = 'enquiry';

    console.log('REQ.BODY ->', req.body);

    const user = new users(req.body);
    user.isRead=false;
    await user.save();
      req.flash("success", "Your message has been sent successfully!");
      res.redirect("/")
    // res.send('Enquiry saved');
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') return res.status(400).send(err.message);
    next(err);
  }
});

// Contact route
router.post('/contact',validateForm, async (req, res, next) => {
  try {
    req.body.type = 'contact';
    const user = new users(req.body);
    await user.save();
    res.send('Contact saved');
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') return res.status(400).send(err.message);
    next(err);
  }
});


module.exports = router;