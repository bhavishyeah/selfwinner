const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000 // 2 minutes
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'selfwinner/notes',
    resource_type: 'raw', // required for PDFs
    allowed_formats: ['pdf'],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

const uploadSingle = upload.single('pdf');

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed'
    });
  }
  next();
};

module.exports = { uploadSingle, handleUploadError };