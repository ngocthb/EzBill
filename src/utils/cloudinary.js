import { CLOUD_NAME, UPLOAD_PRESET } from '@env';

const cloudName = CLOUD_NAME;
const uploadPreset = UPLOAD_PRESET;

export const uploadImageToCloudinary = async (image) => {
  const data = new FormData();

  data.append('file', {
    uri: image.uri,
    type: image.mimeType || 'image/jpeg',
    name: image.fileName || 'upload.jpg',
  });

  data.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Upload failed');
    }

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
