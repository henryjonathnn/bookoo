import multer from "multer";
import path from "path";
import fs from "fs";

const createUploadMiddleware = (options = {}) => {
  const {
    baseDestination = "./public/uploads",
    subFolder = "",
    fieldName = "file",
    allowedTypes = ["image"],
    maxFileSize = 5 * 1024 * 1024, 
    generateFilename = (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    }
  } = options;

  // Determine full destination path
  const destination = path.join(baseDestination, subFolder);

  // Memastikan direktori upload ada
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, generateFilename(req, file));
    },
  });

  // File validation
  const fileFilter = (req, file, cb) => {
    const isAllowedType = allowedTypes.some(type => {
      if (type === 'image') {
        return file.mimetype.startsWith('image/');
      }
      return file.mimetype.includes(type);
    });

    if (isAllowedType) {
      cb(null, true);
    } else {
      cb(new Error(`Hanya file ${allowedTypes.join(', ')} yang diizinkan!`), false);
    }
  };

  // Upload configuration
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: maxFileSize
    }
  });

  return upload;
};

// Upload middlewares call
const coverUpload = createUploadMiddleware({ subFolder: 'covers', fieldName: 'cover_img' });
const profileUpload = createUploadMiddleware({ subFolder: 'profiles', fieldName: 'profile_img' });

export { createUploadMiddleware, coverUpload, profileUpload };