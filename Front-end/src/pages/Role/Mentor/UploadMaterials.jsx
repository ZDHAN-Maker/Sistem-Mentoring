// pages/mentor/material/MaterialManager.jsx
import { useState } from "react";
import useMaterials from "../../../hooks/useMaterials";

import MaterialList from "../../../components/MaterialComponent/MaterialList";
import MaterialModal from "../../../components/MaterialComponent/MaterialModal";
import MaterialVideoPlayer from "../../../components/MaterialComponent/MaterialVideoPlayer";

export default function MaterialManager() {
  const {
    materials,
    activeMaterialId,
    activeVideo,
    selectMaterial,
    saveMaterial,
    deleteMaterial,
    loading,
    uploadProgress,
    errors,
  } = useMaterials();

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video: null,
    schedule_id: "",
    learning_activity_id: "",
  });

  const openCreate = () => {
    setEditMode(false);
    setFormData({ title: "", description: "", video: null });
    setModalOpen(true);
  };

  const openEdit = (m) => {
    setEditMode(true);
    setSelectedId(m.id);
    setFormData({
      title: "",
      description: "",
      video: null,
      schedule_id: "",
      learning_activity_id: "",
    });

    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await saveMaterial(formData, editMode, selectedId);
    if (!res?.error) {
      setModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <MaterialVideoPlayer videoUrl={activeVideo} />

      <MaterialList
        materials={materials}
        activeMaterialId={activeMaterialId}
        onSelect={selectMaterial}
        onEdit={openEdit}
        onDelete={deleteMaterial}
        onCreate={openCreate}
      />

      <MaterialModal
        open={modalOpen}
        close={() => setModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        editMode={editMode}
        loading={loading}
        uploadProgress={uploadProgress}
        errors={errors}
        onSubmit={onSubmit}
      />
    </div>
  );
}
