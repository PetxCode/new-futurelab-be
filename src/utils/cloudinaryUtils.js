const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate Cloudinary configuration on module load
const validateCloudinaryConfig = () => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("❌ Cloudinary configuration incomplete:");
    console.error(
      "  - CLOUDINARY_CLOUD_NAME:",
      process.env.CLOUDINARY_CLOUD_NAME ? "✓" : "✗ missing"
    );
    console.error(
      "  - CLOUDINARY_API_KEY:",
      process.env.CLOUDINARY_API_KEY ? "✓" : "✗ missing"
    );
    console.error(
      "  - CLOUDINARY_API_SECRET:",
      process.env.CLOUDINARY_API_SECRET ? "✓" : "✗ missing"
    );
  } else {
    console.log("✓ Cloudinary configuration loaded successfully");
  }
};

validateCloudinaryConfig();

const uploadToCloudinary = async (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return reject(new Error("No file buffer provided"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "FutureLab/avatars",
        public_id: filename,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          console.log("✅ Avatar uploaded to Cloudinary:", result.secure_url);
          resolve(result);
        }
      }
    );

    // Write the file buffer to the upload stream
    uploadStream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log("✅ Deleted from Cloudinary:", publicId);
  } catch (error) {
    console.error("❌ Error deleting from Cloudinary:", error);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
