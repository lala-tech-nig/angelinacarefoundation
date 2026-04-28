const router = require('express').Router();
const { getTeam, getAllTeam, createMember, updateMember, deleteMember } = require('../controllers/teamController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getTeam);
router.get('/all', protect, getAllTeam);
router.post('/', protect, upload.single('image'), createMember);
router.put('/:id', protect, upload.single('image'), updateMember);
router.delete('/:id', protect, deleteMember);

module.exports = router;
