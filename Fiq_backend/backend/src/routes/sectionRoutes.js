const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
// const upload = require('../middlewares/uploadMiddleware');

router.post('/add', sectionController.addSection);
router.get('/getAllSections', sectionController.getAllSections);
router.get('/getSection/:sectionId', sectionController.getSectionById);

// router.get('/getSectionWithTitles/:sectionId', sectionController.getSectionWithTitles);
// router.get('/getAllSectionsWithTitles', sectionController.getAllSectionsWithTitles);


module.exports = router;