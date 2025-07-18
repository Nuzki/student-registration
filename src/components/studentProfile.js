import React, { useState } from 'react';

const subjects = [
  'Math', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology', 'Computer'
];

const StudentProfile = () => {
  const [marks, setMarks] = useState({});
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setMarks({ ...marks, [e.target.name]: e.target.value });
  };

  const handleUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Uploaded image:', image);
    console.log('Updated marks:', marks);
    alert('Profile and marks updated!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Student Profile</h2>
      <form onSubmit={handleSubmit}>
        {subjects.map((subj) => (
          <div key={subj} className="mb-2">
            <label className="block text-sm font-medium">{subj}</label>
            <input
              className="w-full p-2 border"
              type="number"
              name={subj.toLowerCase()}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Upload Profile Picture</label>
          <input type="file" accept="image/*" onChange={handleUpload} />
        </div>
        <button type="submit" className="bg-green-600 text-white p-2 rounded">Update Profile</button>
      </form>
    </div>
  );
};

export default StudentProfile;