const Joi = require("joi");
const servervalidation = Joi.object({
    type: Joi.string().valid("contact", "enquiry").required(),  

    name: Joi.string()
        .min(2)
        .max(50)
        .required(),

    mobile: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            "string.pattern.base": "Mobile number must be 10 digits."
        }),

    email: Joi.string()
        .email()
        .required(),

    requirementDeatail: Joi.string()
        .required(),

    // Quantity → only required in enquiry
    Quantity: Joi.alternatives().conditional("type", {
        is: "enquiry",
        then: Joi.string().required(),
        otherwise: Joi.string().optional().allow("", null)
    }),

    // productId → only required in enquiry
    productId: Joi.alternatives().conditional("type", {
        is: "enquiry",
        then: Joi.string().required(),
        otherwise: Joi.string().optional().allow("", null)
    }),
});

module.exports = servervalidation;
