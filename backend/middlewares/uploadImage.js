import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/covers"); // Path folder untuk menyimpan gambar yang di upload
  },
  // Fungsi untuk mengacak nama file agar tidak terjadi kesamaan nama file
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Validasi file gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("hanya file gambar yang diizinkan!"), false);
  }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // (limit 5MB)
    }
})

export default upload
