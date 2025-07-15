// src/components/UploadExperience.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faUpload } from "@fortawesome/free-solid-svg-icons";

const CLOUDINARY_UPLOAD_PRESET = "gorillamist_unsigned";
const CLOUDINARY_CLOUD_NAME = "dliw90eyq";
const CLOUDINARY_FOLDER = "gorillamist_uploads";

const UploadExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const fetchExperiences = async () => {
    const snapshot = await getDocs(collection(db, "experiences"));
    const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setExperiences(data);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!name || !description || (!image && !editId)) {
      return alert("Please fill all fields");
    }

    let imageUrl = "";
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", CLOUDINARY_FOLDER);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      imageUrl = res.data.secure_url;
    }

    const experienceData = { name, description };
    if (imageUrl) experienceData.image = imageUrl;

    if (editId) {
      const ref = doc(db, "experiences", editId);
      await updateDoc(ref, experienceData);
    } else {
      await addDoc(collection(db, "experiences"), experienceData);
    }

    setName("");
    setDescription("");
    setImage(null);
    setEditId(null);
    fetchExperiences();
  };

  const handleEdit = (exp) => {
    setName(exp.name);
    setDescription(exp.description);
    setEditId(exp.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "experiences", id));
    fetchExperiences();
  };

  return (
    <div className="bg-fernmist bg-opacity-20 p-6 rounded-lg shadow-lg text-ivorysmoke">
      <h2 className="text-2xl font-bold mb-4">Upload Experiences</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Experience Name"
          className="w-full px-4 py-2 rounded bg-white/20 backdrop-blur-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Experience Description"
          className="w-full px-4 py-2 rounded bg-white/20 backdrop-blur-md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          className="w-full"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button
          type="submit"
          className="bg-rainforest text-white px-4 py-2 rounded hover:bg-deepsoil"
        >
          <FontAwesomeIcon icon={faUpload} /> {editId ? "Update" : "Upload"}
        </button>
      </form>

      {/* List */}
      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-semibold mb-2">Uploaded Experiences</h3>
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-md"
          >
            <img
              src={exp.image}
              alt={exp.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-bold">{exp.name}</h4>
              <p className="text-sm text-ivorysmoke">{exp.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(exp)}
                className="text-rainforest hover:text-deepsoil"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadExperience;
