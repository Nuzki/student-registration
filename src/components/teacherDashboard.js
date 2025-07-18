import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';

// GraphQL Queries and Mutations
const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    getAllStudents {
      _id
      firstName
      lastName
      email
      marks
      role
    }
  }
`;

const UPDATE_STUDENT = gql`
  mutation UpdateStudent(
    $id: ID!
    $firstName: String
    $lastName: String
    $email: String
    $password: String
    $age: Int
    $address: String
    $marks: JSON
    $profilePic: String
    $role: String
  ) {
    updateStudent(
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      age: $age
      address: $address
      marks: $marks
      profilePic: $profilePic
      role: $role
    ) {
      message
      token
      data {
        _id
        firstName
        lastName
        email
        marks
        role
      }
    }
  }
`;

const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id) {
      message
    }
  }
`;

// Main Component
const TeacherDashboard = () => {
  const token = localStorage.getItem('token');
  const userId = token ? jwtDecode(token)?.id : null;
  const { loading, error, data } = useQuery(GET_ALL_STUDENTS, {
    context: { headers: { authorization: token ? `Bearer ${token}` : '' } },
    skip: !token || !userId, // Skip if no valid token or user
  });
  const [updateStudent] = useMutation(UPDATE_STUDENT);
  const [deleteStudent] = useMutation(DELETE_STUDENT);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    marks: '',
  });

  useEffect(() => {
    if (selectedStudent) {
      setEditForm({
        firstName: selectedStudent.firstName || '',
        lastName: selectedStudent.lastName || '',
        email: selectedStudent.email || '',
        marks: JSON.stringify(selectedStudent.marks || {}, null, 2),
      });
    }
  }, [selectedStudent]);

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!token || !userId) return <p>Please log in as a teacher to access this dashboard.</p>;

  const registeredStudents = data?.getAllStudents.filter(
    (student) => student.role === 'student'
  ) || [];

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudent) return;

    let parsedMarks;
    try {
      parsedMarks = editForm.marks ? JSON.parse(editForm.marks) : undefined;
    } catch (e) {
      alert('Invalid JSON format in marks.');
      return;
    }

    const variables = {
      id: selectedStudent._id,
      firstName: editForm.firstName || undefined,
      lastName: editForm.lastName || undefined,
      email: editForm.email || undefined,
      marks: parsedMarks,
      role: selectedStudent.role,
    };

    try {
      const { data: updateRes } = await updateStudent({
        variables,
        context: { headers: { authorization: token ? `Bearer ${token}` : '' } },
        refetchQueries: [{ query: GET_ALL_STUDENTS }],
      });
      console.log('Update success:', updateRes);
      alert('Student updated successfully.');
      setSelectedStudent(null);
    } catch (err) {
      console.error('Update error:', err);
      alert('Update failed: ' + err.message);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent({
        variables: { id },
        context: { headers: { authorization: token ? `Bearer ${token}` : '' } },
        refetchQueries: [{ query: GET_ALL_STUDENTS }],
      });
      alert('Student deleted successfully.');
      setSelectedStudent(null);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Teacher Dashboard</h2>

      {registeredStudents.length === 0 ? (
        <p>No registered students found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Marks</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registeredStudents.map((student) => (
              <tr key={student._id}>
                <td className="border p-2">{`${student.firstName} ${student.lastName}`}</td>
                <td className="border p-2">{student.email}</td>
                <td className="border p-2">
                  {student.marks ? JSON.stringify(student.marks) : 'No marks'}
                </td>
                <td className="border p-2">
                  <button
                    className="bg-yellow-400 px-2 py-1 rounded mr-2"
                    onClick={() => handleSelectStudent(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteStudent(student._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedStudent && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-bold mb-2">
            Edit Student: {selectedStudent.firstName} {selectedStudent.lastName}
          </h3>
          <div className="space-y-2">
            <input
              className="w-full p-2 border"
              placeholder="First Name"
              name="firstName"
              value={editForm.firstName}
              onChange={handleEditChange}
            />
            <input
              className="w-full p-2 border"
              placeholder="Last Name"
              name="lastName"
              value={editForm.lastName}
              onChange={handleEditChange}
            />
            <input
              className="w-full p-2 border"
              placeholder="Email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
            />
            <textarea
              className="w-full p-2 border"
              placeholder="Marks (JSON)"
              name="marks"
              value={editForm.marks}
              onChange={handleEditChange}
              rows={4}
            />
            <div className="space-x-2">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleUpdateStudent}
              >
                Save
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setSelectedStudent(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;