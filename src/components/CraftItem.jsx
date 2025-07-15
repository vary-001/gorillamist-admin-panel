import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function CraftList() {
  const [crafts, setCrafts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchCrafts = async () => {
      const snapshot = await getDocs(collection(db, "crafts"));
      setCrafts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchCrafts();
  }, []);

  const startEdit = (craft) => {
    setEditId(craft.id);
    setFormData({
      name: craft.name,
      description: craft.description,
      price: craft.price,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({});
  };

  const saveEdit = async (id) => {
    const craftRef = doc(db, "crafts", id);
    await updateDoc(craftRef, {
      ...formData,
    });
    // Refresh
    setCrafts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...formData } : item))
    );
    cancelEdit();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "crafts", id));
    setCrafts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {crafts.map((craft) => (
        <div
          key={craft.id}
          className="bg-deepsoil p-4 rounded-lg shadow-lg text-ivorysmoke"
        >
          <img
            src={craft.imageUrl}
            alt={craft.name}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
          {editId === craft.id ? (
            <div className="space-y-2">
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-2 py-1 rounded text-jungle"
              />
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-2 py-1 rounded text-jungle"
              />
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-2 py-1 rounded text-jungle"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => saveEdit(craft.id)}
                  className="bg-limeleaf text-jungle px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold">{craft.name}</h3>
              <p>{craft.description}</p>
              <p className="text-sunleaf font-bold">${craft.price}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => startEdit(craft)}
                  className="text-sm px-3 py-1 bg-rainforest text-ivorysmoke rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(craft.id)}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
