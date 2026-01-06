export default function MaterialList({
  materials,
  activeMaterialId,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
}) {
  return (
    <div className="bg-[#F3E9DD] border border-[#D6C2A5] rounded-2xl p-6 shadow">
      <h3 className="font-bold text-lg mb-4 text-[#5C4632]">Daftar Materi</h3>

      {/* Tombol Upload */}
      <button
        onClick={onCreate}
        className="w-full mb-4 px-4 py-2 bg-[#A47A5E] hover:bg-[#8E6A51] transition text-white rounded-xl font-bold"
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
                flex items-center justify-between px-4 py-3 rounded-xl
                transition-all cursor-pointer shadow-sm border
                ${
                  activeMaterialId === item.id
                    ? "bg-[#B89C7A] text-white border-[#A47A5E]"
                    : "bg-white hover:bg-[#E9D9C7] text-[#4B3A28] border-[#D6C2A5]"
                }
              `}
            >
              <div
                className="flex items-center gap-3 flex-1"
                onClick={() => onSelect(item)}
              >
                <span
                  className={`text-xl font-bold ${
                    activeMaterialId === item.id
                      ? "text-white"
                      : "text-[#8B6A50]"
                  }`}
                >
                  ▶
                </span>
                <span className="font-bold">{item.title}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className={`
                    text-sm font-bold px-3 py-1 rounded-lg transition
                    ${
                      activeMaterialId === item.id
                        ? "bg-white text-[#8B6A50]"
                        : "bg-[#A47A5E] text-white hover:bg-[#8E6A51]"
                    }
                  `}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(item.id)}
                  className="text-sm font-bold px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
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
