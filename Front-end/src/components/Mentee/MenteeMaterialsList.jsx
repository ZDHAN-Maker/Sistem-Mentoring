import React from "react";
import MaterialItem from "./MaterialItem";

export default function MenteeMaterialsList({ materials, progressList, onSelect }) {
  const getProgress = (id) => progressList.find((p) => p.material_id === id);

  return (
    <div className="bg-[#E9DCC8] rounded-xl p-6 shadow-md border border-[#D6C4AC]">
      {materials.map((m) => (
        <MaterialItem
          key={m.id}
          material={m}
          progress={getProgress(m.id)}
          onClick={() => onSelect(m)}
        />
      ))}
    </div>
  );
}
