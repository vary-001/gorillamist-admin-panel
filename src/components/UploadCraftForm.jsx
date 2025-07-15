import React, { useState } from "react";
import axios from "axios";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

export default function UploadCraftForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    if (!imageFile) {
      setError("Please select an image.");
      setUploading(false);
      return;
    }

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "gorillamist_unsigned");
      formData.append("folder", "gorillamist_uploads");

      const cloudinaryRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dliw90eyq/image/upload",
        formData
      );

      const imageUrl = cloudinaryRes.data.secure_url;

      // Save to Firestore
      await addDoc(collection(db, "crafts"), {
        name,
        price,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      // Reset form
      setName("");
      setPrice("");
      setImageFile(null);
      alert("Craft uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload. Check your connection or Cloudinary config.");
    }

    setUploading(false);
  };

  return (
    <div className="bg-deepsoil text-ivorysmoke p-6 rounded-lg shadow-md max-w-lg mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload New Craft</h2>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Craft name"
          className="w-full px-4 py-2 bg-jungle text-ivorysmoke rounded-lg focus:ring-2 focus:ring-sunleaf outline-none"
          required
        />

        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (e.g. $10)"
          className="w-full px-4 py-2 bg-jungle text-ivorysmoke rounded-lg focus:ring-2 focus:ring-limeleaf outline-none"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="block w-full text-sm text-ivorysmoke bg-jungle rounded-lg cursor-pointer"
          required
        />

        <button
          type="submit"
          disabled={uploading}
          className="flex items-center justify-center gap-2 w-full bg-rainforest text-ivorysmoke font-semibold py-2 rounded-lg hover:bg-limeleaf hover:text-jungle transition"
        >
          <FontAwesomeIcon icon={faCloudUploadAlt} />
          {uploading ? "Uploading..." : "Upload Craft"}
        </button>
      </form>
    </div>
  );
}
