export async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Unsigned-vineeth");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dlrvxuntz/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  if (!data.secure_url) throw new Error("Image upload failed.");
  return data.secure_url;
}
