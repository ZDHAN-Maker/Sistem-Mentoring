export default function MaterialList({
  materials,
  activeMaterialId,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
}) {
  return (
    <div className="bg-white border rounded-lg p-5">
      <h3 className="font-bold text-base mb-4">Daftar Materi</h3>

      {/* Tombol Upload */}
      <button
        onClick={onCreate}
        className="w-full mb-4 px-4 py-2 bg-green-600 text-white rounded-lg font-bold"
      >
        + Unggah Materi
      </button>

      {/* List Materi */}
      {materials.length ? (
        <div className="flex flex-col gap-3">
          {materials.map((item) => (
            <div
              key={item.id}
              className={`
                flex items-center justify-between px-4 py-3 rounded-lg
                transition-all cursor-pointer
                ${
                  activeMaterialId === item.id
                    ? "bg-[#a08968] text-white"
                    : "bg-[#c8ad90] hover:bg-[#b89c7a] text-black"
                }
              `}
            >
              {/* Bagian Kiri: Play + Judul */}
              <div
                className="flex items-center gap-3 flex-1"
                onClick={() => onSelect(item)}
              >
                <span className="text-xl font-bold">▶</span>
                <span className="font-bold">{item.title}</span>
              </div>

              {/* Bagian Kanan: Edit & Hapus */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className={`text-sm font-bold px-2 py-1 rounded 
                    ${
                      activeMaterialId === item.id
                        ? "bg-white text-[#a08968]"
                        : "bg-blue-600 text-white"
                    }
                  `}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(item.id)}
                  className={`text-sm font-bold px-2 py-1 rounded 
                    ${
                      activeMaterialId === item.id
                        ? "bg-red-600 text-white"
                        : "bg-red-600 text-white"
                    }
                  `}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Belum ada materi</p>
      )}
    </div>
  );
}
