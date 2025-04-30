const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');


router.post('/banners', bannerController.createBanner);


router.get('/banners', bannerController.getAllBanners);


router.put('/banners/:id', bannerController.updateBanner);


router.delete('/banners/:id', bannerController.deleteBanner);

router.patch('/banners/:id/toggle', bannerController.toggleBannerStatus);

module.exports = router;
