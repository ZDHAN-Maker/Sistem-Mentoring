import Button from "../../components/Button";
import InputField from "../../components/InputField";

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md space-y-4"
      >
        <h3 className="font-semibold text-lg">
          {editMode ? "Edit Materi" : "Unggah Materi"}
        </h3>

        <InputField
          label="Judul"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        {errors.title && <p>{errors.title[0]}</p>}

        <InputField
          name="description"
          label="Deskripsi"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="file"
          name="video"
          accept="video/*"
          onChange={handleChange}
        />

        {loading && uploadProgress > 0 && (
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button onClick={close} type="button">
            Batal
          </Button>
          <Button type="submit">
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
