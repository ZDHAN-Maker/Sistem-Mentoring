import React, { useState } from "react";
import useLearningActivities from "../../../hooks/mentee/useLearningActivities";
import MenteeMaterialsList from "../../../components/Mentee/MenteeMaterialsList";
import MaterialDetail from "../../../components/Mentee/MaterialDetail";

const MenteeMaterials = () => {
  const { materials, progress, loading, error } = useLearningActivities();

  const [selectedMaterial, setSelectedMaterial] = useState(null);

  if (loading) return <p>Loading materi...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">

      {!selectedMaterial ? (
        <>
          <h1 className="text-3xl font-bold">Kelas Yang Dipelajari</h1>
        
          <MenteeMaterialsList
            materials={materials}
            progressList={progress}
            onSelect={(m) => setSelectedMaterial(m)}
          />
        </>
      ) : (
        <MaterialDetail
          material={selectedMaterial}
          onBack={() => setSelectedMaterial(null)}
        />
      )}
    </div>
  );
};

export default MenteeMaterials;
