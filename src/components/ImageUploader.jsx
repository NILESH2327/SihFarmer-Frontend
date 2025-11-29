import React, { useState } from "react";

export default function CloudinaryUploader({ images, setImages }) {
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function uploadToCloudinary(e) {
    const files = Array.from(e.target.files).slice(0, 6 - images.length);
    if (files.length === 0) return;

    setLoading(true);
    setUploadError("");

    const uploaded = [];

    try {
      for (let file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "KrishiSakhi"); 
        formData.append("folder", "contract");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/ddyjj570n/image/upload`,
          { method: "POST", body: formData }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error?.message || `Upload failed: ${res.status}`);
        }

        const data = await res.json();
        console.log(data);
        
        // Store BOTH file AND Cloudinary URL for wizard compatibility
        uploaded.push({
          file,        // Original file for FormData submission
          url: data.secure_url  // Cloudinary URL for preview
        });
      }

      setImages((prev) => [...prev, ...uploaded].slice(0, 6));
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Upload Box */}
      <label className="flex items-center justify-center border-2 border-dashed border-green-300 
                        rounded-lg h-28 cursor-pointer bg-green-50 hover:bg-green-100 transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={uploadToCloudinary}
          disabled={loading}
          className="hidden"
        />
        <div className="text-center">
          <svg
            className="mx-auto h-7 w-7 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v9M12 3v6m0 0l3-3m-3 3L9 6"
            />
          </svg>
          <p className="text-sm text-gray-600 mt-1">
            {loading ? "Uploading..." : "Click to upload images"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {images.length > 0 ? `${images.length}/6 uploaded` : "Max 6 images"}
          </p>
        </div>
      </label>

      {/* Error */}
      {uploadError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          {uploadError}
        </div>
      )}

      {/* Remove uploader's preview - wizard handles it */}
    </div>
  );
}
