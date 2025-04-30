const express = require('express');
const router = express.Router();
const movienewsController = require('../controllers/movienewsController');
const upload=require('../middlewares/uploadMiddleware')



router.post('/addmovienews',movienewsController.addMovieNews);

router.get('/latest', movienewsController.getLatestMovieNews);

router.get('/:id',movienewsController.getMovieNewsById);



router.get('/',movienewsController.getMovieNews);

module.exports = router;


module.exports = router;