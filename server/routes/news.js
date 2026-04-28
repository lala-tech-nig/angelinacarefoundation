const router = require('express').Router();
const { getPublishedNews, getNewsById, getAllNews, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getPublishedNews);
router.get('/all', protect, getAllNews);
router.get('/:id', getNewsById);
router.post('/', protect, upload.single('image'), createNews);
router.put('/:id', protect, upload.single('image'), updateNews);
router.delete('/:id', protect, deleteNews);

module.exports = router;
