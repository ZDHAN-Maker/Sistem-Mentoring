import React, { useState } from "react";
import { Upload, Play, X } from "lucide-react";

const UploadMaterials = () => {
  const [lessons, setLessons] = useState([
    { id: 1, title: "Belajar React", locked: false },
    { id: 2, title: "Belajar Tailwind", locked: false },
    { id: 3, title: "Belajar Fundamental", locked: false },
    { id: 4, title: "Belajar Section", locked: false },
    { id: 5, title: "Belajar Struktur", locked: false }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newLesson, setNewLesson] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const handleAddLesson = () => {
    if (newLesson.trim()) {
      setLessons([
        ...lessons,
        { id: lessons.length + 1, title: newLesson, locked: false }
      ]);
      setNewLesson("");
      setVideoFile(null);
      setShowModal(false);
    }
  };

  const handleDeleteLesson = (id) => {
    setLessons(lessons.filter(lesson => lesson.id !== id));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Upload Materials</h1>
          <p className="text-gray-600 mt-2">Kelola materi pembelajaran Anda</p>
        </div>

        {/* Video Preview Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-center bg-gray-100 rounded-xl h-80">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 border-4 border-gray-300 rounded-full flex items-center justify-center">
                <Play className="w-10 h-10 text-gray-400 ml-1" />
              </div>
              <p className="text-gray-500">Preview video akan muncul di sini</p>
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {lessons.length} Lessons
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Lesson
            </button>
          </div>

          {/* Lessons List */}
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-amber-200 hover:bg-amber-300 rounded-full px-6 py-3 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-800">{lesson.title}</span>
                </div>
                <button
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-5 h-5 text-red-600 hover:text-red-700" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Upload */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Upload Lesson Baru</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Input Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Lesson
                  </label>
                  <input
                    type="text"
                    value={newLesson}
                    onChange={(e) => setNewLesson(e.target.value)}
                    placeholder="Masukkan judul lesson..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Upload Video */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Video
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {videoFile ? videoFile.name : "Klik untuk upload video"}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        MP4, AVI, MOV (Max 500MB)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddLesson}
                    className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadMaterials;