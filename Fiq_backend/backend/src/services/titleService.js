const Title = require('../models/titleModel');
const Section = require('../models/sectionModel');

exports.addTitle = async (sectionId, title, imageUrl) => {


const sectionExists = await Section.findById(sectionId);
if (!sectionExists) {
    throw new Error("Section does not exist");
}

const existingTitle = await Title.findOne({ title });
if (existingTitle) {
    throw new Error("Title already exists.");
}

const newTitle = new Title({ section:sectionId, title, imageUrl });
const savedTitle = await newTitle.save();

// Push the new title into the corresponding section
await Section.findByIdAndUpdate(sectionId, { 
    $push: { titles: savedTitle._id } 
});

return savedTitle;
};

exports.getAllTitles = async () => {
    let titles = await Title.find()
    .populate({
        path: "section",
        select: "title imageUrl createdAt" 
    })
    
    .sort({ createdAt: -1 }).lean()
    
    // titles = titles.map((title) => ({
    //     ...title,
    //     rating: title.rating ? parseFloat(title.rating.toString()) : null,
    // }));
    //    return titles.length ? titles : []; 

    return titles.map(title => ({
        ...title,
        rating: title.rating ? parseFloat(title.rating.toString()) : null
        // rating: title.rating ? parseFloat(title.rating.toString()).toFixed(1) : "0.0",
    }));
  
};

exports.getTitlesBySectonId = async (sectionId) => {
    // const titles = await Title.find().sort({ createdAt: -1 });
    // const titles = await Title.findById(sectionId);
    const data = await Title.find({ section: sectionId }).sort({ createdAt: -1 });
    return data.length ? data : [];
};

exports.getTitle = async (id) => {
    // const title = await Title.findById(id)
    // .populate("sectionId", "sectionName");;

    const title = await Title.findById(id)
    .populate("section", "title rating imageUrl") .lean()
    .exec();  // Populate section title & image

    if (!title) {
        throw new Error("Title not found");
    }
    if (title.rating && title.rating.toString) {
        title.rating = parseFloat(title.rating.toString());
    }


    return title;
};