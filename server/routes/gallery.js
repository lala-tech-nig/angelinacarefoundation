const router = require('express').Router();
const { getGallery, getAllGallery, uploadImage, updateImage, deleteImage } = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getGallery);
router.get('/all', protect, getAllGallery);
router.post('/', protect, upload.single('image'), uploadImage);
router.put('/:id', protect, upload.single('image'), updateImage);
router.delete('/:id', protect, deleteImage);

module.exports = router;
