const MovieNewsModel= require('../models/movienewsModel');

exports.addMovieNews = async ({ title, description, imageUrl,images }) => {
       
        try {
            // let imageUrl = null;
    
            // let finalImageUrl=imageUrl;
        
          
            // if (!finalImageUrl) {
            //     return res.status(400).json({ error: "Image file or URL is required" });
            // }
            const news = new MovieNewsModel({
            title,
            description,
            imageUrl,
            images,
            });
        
            return await news.save(); 
        } catch (error) {
            throw new Error("Error saving movie news: " + error.message);
        }
 };

// exports.getMovieNews = async () => {

//     //Return  latest new first
//     return await MovieNewsModel.find().sort({ createdAt: -1 });
// }
exports.getMovieNews = async () => {
    const newsList = await MovieNewsModel.find().sort({ createdAt: -1 });

    
    return newsList.map(news => ({
        ...news._doc,
        createdAt: new Date(news.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    }));
};

exports.getMovieNewsById = async (id) => {
    const news = await MovieNewsModel.findById(id);
    if (!news) return null;
    
    return {
        ...news._doc,
        createdAt: new Date(news.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    };
};

exports.getLatestMovieNews = async ({ page, limit, search }) => {
    const query = {};
    if (search) query.title = { $regex: search, $options: "i" }; 
    const news = await MovieNewsModel.find(query)
        .sort({ createdAt: -1 })  
        .skip((page - 1) * limit) 
        .limit(limit);

    const totalNews = await MovieNewsModel.countDocuments(query);

    return {
        news,
        totalNews,
        currentPage: page,
        totalPages: Math.ceil(totalNews / limit)
    };
};




