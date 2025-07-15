// pages/Dashboard.jsx
import React from 'react';


import AnnouncementForm from "../components/AnnouncementForm";
import UploadCraftForm from '../components/UploadCraftForm';
import CraftList from '../components/CraftList';
import UploadExperience from "../components/UploadExperience"; 

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-jungle text-ivorysmoke px-6 py-12">
      <h1 className="text-3xl font-heading mb-6">Admin Dashboard</h1>
       <AnnouncementForm />
      <UploadCraftForm />
      <CraftList />
       <UploadExperience />

    </div>
  );
}
