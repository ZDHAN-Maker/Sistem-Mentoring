import { useState } from "react";
import useMaterials from "../../../hooks/useMaterials";

import MaterialList from "../../../components/MaterialComponent/MaterialList";
import MaterialModal from "../../../components/MaterialComponent/MaterialModal";
import MaterialVideoPlayer from "../../../components/MaterialComponent/MaterialVideoPlayer";
import Button from "../../../components/Button";

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
      title: m.title,
      description: m.description || "",
      video: null,
    });
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await saveMaterial(formData, editMode, selectedId);
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Video Player lebih besar */}
      <div className="w-full">
        <div className="w-full max-w-7xl mx-aut ">
          <MaterialVideoPlayer videoUrl={activeVideo} />
        </div>
      </div>

      {/* Daftar materi di bawah video */}
      <div className="w-full max-w-5xl mx-auto">
        <MaterialList
          materials={materials}
          activeMaterialId={activeMaterialId}
          onSelect={selectMaterial}
          onEdit={openEdit}
          onDelete={deleteMaterial}
          onCreate={openCreate}
        />
      </div>

      {/* Modal */}
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
