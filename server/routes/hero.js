const router = require('express').Router();
const { getSlides, getAllSlides, createSlide, updateSlide, deleteSlide } = require('../controllers/heroController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getSlides);
router.get('/all', protect, getAllSlides);
router.post('/', protect, upload.single('image'), createSlide);
router.put('/:id', protect, upload.single('image'), updateSlide);
router.delete('/:id', protect, deleteSlide);

module.exports = router;
