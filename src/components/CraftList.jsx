// components/CraftList.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import CraftItem from './CraftItem';

export default function CraftList() {
  const [crafts, setCrafts] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'crafts'), (snap) => {
      setCrafts(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "crafts", id));
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-sunleaf mb-4">Uploaded Crafts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {crafts.map(craft => (
          <CraftItem key={craft.id} craft={craft} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
