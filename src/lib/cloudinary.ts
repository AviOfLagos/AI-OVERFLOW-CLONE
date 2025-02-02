// src/lib/cloudinary.ts

export interface CloudinaryUploadResponse {
  secure_url: string;
  // Include other properties if needed
}

export async function uploadImage(file: File): Promise<CloudinaryUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'aioverflow_uploads');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) throw new Error('Upload failed');
  return response.json() as Promise<CloudinaryUploadResponse>;
}