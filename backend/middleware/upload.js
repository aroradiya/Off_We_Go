const multer = require("multer");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DOCUMENT_TYPES = [...IMAGE_TYPES, "application/pdf"];

function makeUploader(allowedTypes, maxSize) {
    return multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: maxSize, files: 1 },
        fileFilter: (req, file, cb) => {
            if (allowedTypes.includes(file.mimetype)) return cb(null, true);
            const error = new Error("This file type is not allowed");
            error.status = 400;
            cb(error);
        },
    });
}

function single(uploader, fieldName) {
    return (req, res, next) => {
        uploader.single(fieldName)(req, res, (error) => {
            if (!error) return next();
            if (error instanceof multer.MulterError) {
                const message = error.code === "LIMIT_FILE_SIZE" ? "File is too large" : error.message;
                return res.status(400).json({ message });
            }
            next(error);
        });
    };
}

exports.uploadImage = (fieldName) => single(makeUploader(IMAGE_TYPES, MAX_IMAGE_SIZE), fieldName);
exports.uploadDocument = (fieldName) => single(makeUploader(DOCUMENT_TYPES, MAX_DOCUMENT_SIZE), fieldName);