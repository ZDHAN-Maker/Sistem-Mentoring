import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    // Mock file upload response
    console.log('File uploaded:', file.name);
    console.log('Description:', description);
    
    alert('Material uploaded successfully!');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Upload Learning Material</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="file-upload" className="block text-gray-700 text-sm font-medium mb-2">Choose File</label>
          <input
            type="file"
            id="file-upload"
            accept=".pdf, .docx, .pptx, .zip"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">Material Description</label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Add a brief description of the material..."
            rows="4"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button type="submit" className="w-full bg-brown-600 text-white py-2 rounded-lg hover:bg-brown-700">
          Upload Material
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
