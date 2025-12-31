const express = require("express");
const router = express.Router();
const product = require("../models/product.js");
const wrapasync = require("../wrapasync.js");
const ExpressError = require("../ExpressError");
const servervalidation = require("../servervalidation.js");

// Home Page
router.get("/", wrapasync(async (req, res) => {
    const allproducts = await product.find().sort({ createdAt: -1 }).limit(16);
    res.render("product/index.ejs", { 
        allproducts,
        pageTitle: "Home | LX Max Electricals",
        pageDescription: "LX Max Electricals is a leading manufacturer of decorative, street light, high mast, camera and traffic signal poles in India.",
        pageCanonical: "https://www.lxmaxelectricals.com/"
    });
}));

// Show Product Info Page
router.get("/showproductinfo/:id", wrapasync(async (req, res, next) => {
    try {
        const { id } = req.params;
        const findproducts = await product.findById(id);
        if (!findproducts) throw new ExpressError(404, "Product not found");

        const allproducts = await product.find().sort({ createdAt: -1 }).limit(4);

        res.render("product/showproductinfo.ejs", { 
            findproducts, 
            allproducts,
            pageTitle: `${findproducts.title} | LX Max Electricals`,
            pageDescription: findproducts.description || "Premium decorative and street lighting poles manufacturer in India.",
            pageCanonical: `https://www.lxmaxelectricals.com/showproductinfo/${id}`
        });
    } catch (error) {
        next(error);
    }
}));
router.get("/showinfomodal/:id", wrapasync(async(req, res) => {
    const { id } = req.params;
    const findproduct = await product.findById(id);
    if (!findproduct) throw new ExpressError(404, "Product not found");
    res.json(findproduct);
}));
// Product List Page
router.get("/product", wrapasync(async (req, res) => {
    const category = req.query.category || "all";

    let filter = {};
    if (category !== "all") {
        filter.category = category;
    }

    const allproducts = await product.find(filter);
    const hasProducts = allproducts.length > 0;

    res.render("product/product.ejs", { 
        allproducts,
        category,
        hasProducts,
        pageTitle: category !== "all" ? `${category} Products | LX Max Electricals` : "All Products | LX Max Electricals",
        pageDescription: category !== "all" ? `Browse ${category} products from LX Max Electricals.` : "Explore all decorative, street light, high mast, camera and traffic signal poles from LX Max Electricals.",
        pageCanonical: category !== "all" ? `https://www.lxmaxelectricals.com/product?category=${category}` : "https://www.lxmaxelectricals.com/product"
    });
}));

// About Page
router.get("/about", (req, res) => 
    res.render("product/about.ejs", { 
        pageTitle: "About Us | LX Max Electricals",
        pageDescription: "Learn more about LX Max Electricals, a leading manufacturer of decorative and street light poles in India.",
        pageCanonical: "https://www.lxmaxelectricals.com/about"
    })
);

// Contact Page
router.get("/contact", (req, res) => 
    res.render("product/contact.ejs", { 
        pageTitle: "Contact Us | LX Max Electricals",
        pageDescription: "Get in touch with LX Max Electricals for decorative, street light, camera and traffic signal poles.",
        pageCanonical: "https://www.lxmaxelectricals.com/contact"
    })
);

module.exports = router;
