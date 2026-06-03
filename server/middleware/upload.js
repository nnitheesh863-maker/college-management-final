import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'college-erp/assignments',
    resource_type: 'auto',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    transformation: [{ quality: 'auto' }],
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: PDF, DOC/DOCX, JPG, PNG`), false);
    }
  },
});

export function handleUploadError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}
