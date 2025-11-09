const cloudinary = require('../utils/cloudConfig');

exports.create = async (req, res) => {
  try {
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      // Upload each file to Cloudinary
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) throw error;
          return result;
        });
        imageUrls.push(result.secure_url);
      }
    } else if (Array.isArray(req.body.image)) {
      imageUrls = req.body.image;
    }
    if (imageUrls.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }
    // ...rest of your create logic, using image: imageUrls
  } catch (e) {
    res.status(500).json({ message: 'Failed to create salon', error: e.message });
  }
}; 