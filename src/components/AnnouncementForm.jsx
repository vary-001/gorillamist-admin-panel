// src/components/AnnouncementForm.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AnnouncementForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const docRef = doc(db, "announcements", "banner");

  // Fetch existing banner
  useEffect(() => {
    const fetchAnnouncement = async () => {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setMessage(snap.data().message);
      }
    };
    fetchAnnouncement();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(docRef, { message });
      alert("Announcement updated!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-deepsoil bg-opacity-40 p-6 rounded-lg shadow-md text-ivorysmoke">
      <h3 className="text-xl font-bold mb-4">📢 Edit Announcement Banner</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows="4"
          className="w-full p-3 rounded bg-jungle text-sunleaf focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter banner text here..."
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-deepsoil text-ivorysmoke px-4 py-2 rounded font-semibold hover:bg-rainforest transition"
        >
          {loading ? "Updating..." : "Update Banner"}
        </button>
      </form>
    </div>
  );
}
