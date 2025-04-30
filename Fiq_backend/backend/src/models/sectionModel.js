const mongoose = require('mongoose');
// const titleModel = require('../models/titleModel');

const sectionSchema = mongoose.Schema({
   title: { type: String, required: true, unique: true, index: true },
   imageUrl: { type: String, required: true },
   titles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Title" }]
}, { timestamps: true });

module.exports = mongoose.model("Section", sectionSchema);