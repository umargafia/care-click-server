import asyncHandler from 'express-async-handler';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400);
    throw new Error('No files were uploaded');
  }

  const file = req.files.image;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    res.status(400);
    throw new Error('Invalid file type. Only JPEG, PNG and GIF allowed');
  }

  // Create unique filename
  const timestamp = Date.now();
  const ext = path.extname(file.name);
  const filename = `${timestamp}${ext}`;

  const uploadPath = path.join(uploadsDir, filename);

  try {
    await file.mv(uploadPath);

    // Return the URL for the uploaded file
    const fileUrl = `/uploads/${filename}`;

    res.json({
      message: 'File uploaded successfully',
      url: fileUrl,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Error uploading file');
  }
});
