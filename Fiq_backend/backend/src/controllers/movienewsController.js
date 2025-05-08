const movieNewsService = require('../services/movienewsService');
//const User = require('../models/userModel');
const { sendPushToAllUsers } = require('../services/firebaseService');
exports.addMovieNews = async (req, res) => {
    try {
     
        const { title, description,images } = req.body;

           // Check if imageUrl is present in the request body
           let { imageUrl } = req.body;
        
           // If imageUrl is not provided, assign an empty object
           if (!imageUrl) {
               imageUrl = {};
           }
        //const imageFile=req.file;
        console.log("Received imageUrl:", imageUrl);
        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ error: "At least one image set is required" });
        }

    const news = await movieNewsService.addMovieNews({ title, description, imageUrl,images });

    await sendPushToAllUsers('New Movie News!', `${title}: ${description}`);

    const responseNews = {
        ...news.toObject(),
        imageUrl: imageUrl || {},  // Ensure imageUrl is empty if not provided
    };


  
    // // 2. Get all users with a valid FCM token
    // const users = await User.find({ fcmToken: { $ne: null } });

    // // 3. Build FCM message payload
    // const message = {
    //   notification: {
    //     title: 'New Movie News!',
    //     body: `${title}: ${description}`,
    //   },
    // };

    // // 4. Send notification to each user
    // for (const user of users) {
    //   if (user.fcmToken) {
    //     await sendNotification(user.fcmToken, message);
    //   }
    // }

        // res.status(201).json({ message: "Movie news added successfully", news });
        // console.log(news, "movienews");

        res.status(201).json({ message: "Movie news added successfully", news: responseNews });
        console.log(responseNews, "movienews");
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("movienews error:", error);
    }
};
exports.getMovieNewsById=async(req,res)=>{
    try{
        const {id}=req.params
        const news=await movieNewsService.getMovieNewsById(id);
        if (!news) {
            return res.status(404).json({ error: "Movie news not found" });
        }
        res.json(news);
    }catch(error){
        res.status(500).json({error:error.message});
    }
}
exports.getMovieNews = async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;
        const news = await movieNewsService.getMovieNews({ title, description, imageUrl });
        
        res.status(201).json({ message: 'Movie news added successfully', news });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error,"movienews error");
        
    }
};

exports.getLatestMovieNews = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;

        const news = await movieNewsService.getLatestMovieNews({
            page: parseInt(page),
            limit: parseInt(limit),
            search
        });

        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}