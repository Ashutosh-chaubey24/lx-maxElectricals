const Joi = require("joi");
// Admin Register
const adminRegisterSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters"
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters"
  })
});

// Admin Login
const adminLoginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required"
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required"
  })
});
// Proudct scema 

const productSchema = Joi.object({
  title: Joi.string()
    .required()
    .messages({
      "string.empty": "Product title is required",
    }),
  description: Joi.string()
    .allow("")
    .max(500),

  category: Joi.string().allow(""),
  material: Joi.string().allow(""),
  height: Joi.string().allow(""),
});
module.exports = {
  adminRegisterSchema,
  adminLoginSchema,
  productSchema 
};
