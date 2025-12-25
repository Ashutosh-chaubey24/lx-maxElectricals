const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    type: {
  type: String,
  enum: ["enquiry", "contact"],
  required: false,
  default: "enquiry"  // optional: koi default rakhna ho toh
},

    name: {
        type: String,
        required: true,
        trim: true
    },

    mobile: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true
    },

    Quantity: {
        type: String,
        required: false,
        default: null
    },

    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product",
        required: false,
        default: null
    },

    requirementDeatail: {
        type: String,
        required: true,
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
      isRead: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", userSchema);
