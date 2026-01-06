export default function MaterialModal({
  open,
  close,
  formData,
  setFormData,
  editMode,
  loading,
  uploadProgress,
  errors,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={onSubmit}
        className="bg-[#F9F4EE] p-6 rounded-2xl w-full max-w-lg space-y-4 border border-[#D6C2A5] shadow-xl"
      >
        <h2 className="text-xl font-bold text-[#5C4632]">
          {editMode ? "Edit Materi Video" : "Upload Materi Video"}
        </h2>

        {/* TITLE */}
        <div>
          <input
            type="text"
            placeholder="Judul Materi"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border p-3 rounded-xl bg-white border-[#D2C1A9]"
            required
          />
          {errors?.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title[0]}
            </p>
          )}
        </div>

        {/* DESCRIPTION */}
        <textarea
          placeholder="Deskripsi (opsional)"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full border p-3 rounded-xl bg-white border-[#D2C1A9]"
          rows={3}
        />

        {/* VIDEO */}
        <div>
          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              setFormData({
                ...formData,
                video: e.target.files[0],
              })
            }
            className="w-full text-[#5C4632]"
            required={!editMode}
          />
          {errors?.video && (
            <p className="text-red-500 text-sm mt-1">
              {errors.video[0]}
            </p>
          )}
        </div>

        {/* PROGRESS */}
        {loading && (
          <div className="w-full bg-gray-200 rounded-xl overflow-hidden">
            <div
              className="bg-[#A47A5E] text-center text-white text-sm p-1 transition-all"
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}%
            </div>
          </div>
        )}

        {/* BUTTON */}
        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={close}
            className="px-4 py-2 border border-[#C4B29B] rounded-xl text-[#5C4632] hover:bg-[#EDE2D3]"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#A47A5E] hover:bg-[#8E6A51] text-white rounded-xl"
          >
            {loading ? "Mengupload..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
