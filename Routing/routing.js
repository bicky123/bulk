const express = require('express');
const home_controller = require('../Controllers/home');

const router = express.Router();

router.get('/',home_controller.getSpotifySongList);
router.post('/search',home_controller.searchSpotifySong);
router.post('/list',home_controller.getSpotifySongList);
router.post('/xlsx',home_controller.xlsx);



module.exports = router;