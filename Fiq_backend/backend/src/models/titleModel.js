const mongoose = require('mongoose');

const titleSchema = new mongoose.Schema({
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" ,required: true },
    title: { type: String, required: true, unique: true },
    // imageUrl: { type: String, required: true },
    imageUrl: {
        landscape: { type: String, default: "" },
        portrait: { type: String, default: "" },
        thumbnail: { type: String, default: "" },
      },
    rating: { type: mongoose.Schema.Types.Decimal128 }, // Force Decimal storage
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Title', titleSchema);