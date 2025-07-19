const multer = require("multer");
const path = require("path");

const maxSize = 1024 * 1024 * 1024; // 150MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `FILE-${Date.now()}${ext}`);
    },
});


const fileFilter = (req, file, cb) => {
    const allowedExtensions = /\.(jpg|jpeg|png|gif|glb|gltf)$/i;
    if (!allowedExtensions.test(file.originalname)) {
        return cb(new Error("Only image and 3D model files are allowed."), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSize },
});

module.exports = upload;
