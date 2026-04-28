const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'angelina-care/general';
    if (req.baseUrl.includes('hero')) folder = 'angelina-care/hero';
    if (req.baseUrl.includes('gallery')) folder = 'angelina-care/gallery';
    if (req.baseUrl.includes('team')) folder = 'angelina-care/team';
    if (req.baseUrl.includes('news')) folder = 'angelina-care/news';
    if (req.baseUrl.includes('programs')) folder = 'angelina-care/programs';
    return {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = { cloudinary, upload };
