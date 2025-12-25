const express = require("express");
const router = express.Router();
const product = require("../models/product.js");
const wrapasync = require("../wrapasync.js");
const ExpressError = require("../ExpressError");
const servervalidation=require("../servervalidation.js")

// Home Page
router.get("/", wrapasync(async (req, res) => {
    const allproducts = await product.find().sort({ createdAt: -1 }).limit(16);
    console.log(allproducts)
    res.render("product/index.ejs", { allproducts });
}));

// Show Info Modal
router.get("/showinfomodal/:id", wrapasync(async(req, res) => {
    const { id } = req.params;
    const findproduct = await product.findById(id);
    if (!findproduct) throw new ExpressError(404, "Product not found");
    res.json(findproduct);
}));

// Show Product Info Page
router.get("/showproductinfo/:id", async (req, res ,next) => {
    try {
        console.log("✅ Route hit for /showproductinfo/:id"); // Debug
    const { id } = req.params;
    const findproducts = await product.findById(id);
    if (!findproducts) {
        console.log("❌ Product not found in DB");
        throw new ExpressError(404, "Product not found");
    }
    console.log("✅ Product found:", findproducts);

    const allproducts = await product.find().sort({ createdAt: -1 }).limit(4);
    res.render("product/showproductinfo.ejs", { findproducts, allproducts });
    } catch (error) {
        next(error)
    }
    
});

// Product List Page
// Product List Page
router.get("/product", wrapasync(async (req, res) => {
    const category = req.query.category || "all";

    let filter = {};
    if (category !== "all") {
        filter.category = category;
    }

    const allproducts = await product.find(filter);

    // Check if products exist
    const hasProducts = allproducts.length > 0;

    res.render("product/product.ejs", { 
        allproducts,
        category,
        hasProducts
    });
}));



// About Page
router.get("/about", (req,res) => res.render("product/about.ejs"));

// Contact Page
router.get("/contact", (req,res) => res.render("product/contact.ejs"));

module.exports = router;
