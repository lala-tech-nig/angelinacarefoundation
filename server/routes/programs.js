const router = require('express').Router();
const { getPrograms, getAllPrograms, createProgram, updateProgram, deleteProgram } = require('../controllers/programController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getPrograms);
router.get('/all', protect, getAllPrograms);
router.post('/', protect, upload.single('image'), createProgram);
router.put('/:id', protect, upload.single('image'), updateProgram);
router.delete('/:id', protect, deleteProgram);

module.exports = router;
