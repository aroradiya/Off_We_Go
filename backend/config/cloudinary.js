const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadBuffer(buffer, { folder, resourceType = "image" }) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "offwego/" + folder, resource_type: resourceType },
            (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
    });
}

function deleteFile(publicId, resourceType = "image") {
    return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

module.exports = { uploadBuffer, deleteFile };