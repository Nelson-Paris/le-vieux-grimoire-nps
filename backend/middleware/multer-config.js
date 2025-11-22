const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {

    const originalName = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
    const cleanName = originalName.replace(/ /g, '_');
    const extension = MIME_TYPES[file.mimetype];
    const finalName = `${cleanName}-${Date.now()}.${extension}`;

    callback(null, finalName);
  }
});

module.exports = multer({ storage: storage }).single('image');