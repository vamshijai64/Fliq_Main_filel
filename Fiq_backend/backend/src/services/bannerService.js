const Banner = require('../models/BannerModel');


const addBanner = async (bannerData) => {

    const { name, imageUrl, startDate, endDate, bannerType, ...additionalData } = bannerData;

    const banner = new Banner({
        name,
        imageUrl,
        startDate,
        endDate,
        bannerType: bannerType || null, 
        additionalData
    });

    await banner.save();
    console.log(" Banner created:", banner);
    return banner;
};


const getAllBanners = async () => {
  return await Banner.find().sort({ priority: -1, startDate: -1 });
};


//  Update a banner
const updateBanner = async (id, bannerData) => {
    return await Banner.findByIdAndUpdate(id, bannerData, { new: true });
};

//  Delete a banner
const deleteBanner = async (id) => {
    return await Banner.findByIdAndDelete(id);
};

//  Toggle `isActive`
const toggleBannerStatus = async (id) => {
    const banner = await Banner.findById(id);
    banner.isActive = !banner.isActive;
    await banner.save();
    return banner;
};

module.exports = {
    addBanner,
    getAllBanners,
    updateBanner,
    deleteBanner,
    toggleBannerStatus 
};





 