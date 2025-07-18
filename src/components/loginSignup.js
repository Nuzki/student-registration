import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!, $role: String!) {
    login(email: $email, password: $password, role: $role) {
      message
      token
      data {
        _id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($firstName: String!, $lastName: String!, $email: String!, $password: String!, $age: Int!, $address: String!, $role: String!) {
    signup(firstName: $firstName, lastName: $lastName, email: $email, password: $password, age: $age, address: $address, role: $role) {
      message
      token
      data {
        _id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isTeacher, setIsTeacher] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: 19,
    address: '',
  });

  const navigate = useNavigate();
  const [login] = useMutation(LOGIN_MUTATION);
  const [signup] = useMutation(SIGNUP_MUTATION);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInput = (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) return 'Invalid email format.';
    if (!data.password || data.password.length < 6) return 'Password must be at least 6 characters.';
    if (!isLogin) {
      const nameRegex = /^[A-Za-z]+$/;
      if (!data.firstName || !nameRegex.test(data.firstName)) return 'First name must contain only letters.';
      if (!data.lastName || !nameRegex.test(data.lastName)) return 'Last name must contain only letters.';
      if (!data.age || parseInt(data.age, 10) < 19) return 'Age must be at least 19.';
      if (!data.address) return 'Address is required.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting with role:', isTeacher ? 'teacher' : 'student', formData);
    const validationError = validateInput(formData);
    if (validationError) {
      alert(validationError);
      return;
    }
    const variables = {
      email: formData.email.trim(),
      password: formData.password.trim(),
      role: isTeacher ? 'teacher' : 'student',
      ...(isLogin ? {} : { firstName: formData.firstName.trim(), lastName: formData.lastName.trim(), age: parseInt(formData.age, 10), address: formData.address.trim() }),
    };

    try {
      const response = isLogin
        ? await login({ variables })
        : await signup({ variables });
      const { token } = response.data[isLogin ? 'login' : 'signup'];
      localStorage.setItem('token', token);
      navigate(isTeacher ? '/teacher/dashboard' : '/student/profile');
    } catch (error) {
      alert(error.message || 'Authentication failed.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">{isLogin ? 'Login' : 'Signup'} - {isTeacher ? 'Teacher' : 'Student'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              className="w-full p-2 mb-2 border"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-2 mb-2 border"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-2 mb-2 border"
              type="number"
              placeholder="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="19"
              required
            />
            <input
              className="w-full p-2 mb-2 border"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          className="w-full p-2 mb-2 border"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 mb-2 border"
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          {isLogin ? 'Login' : 'Signup'}
        </button>
      </form>
      <div className="mt-4">
        <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-600">
          {isLogin ? 'Need an account? Signup' : 'Already have an account? Login'}
        </button>
        <div className="mt-2">
          <label className="mr-2 text-sm">Are you a teacher?</label>
          <input type="checkbox" checked={isTeacher} onChange={() => setIsTeacher(!isTeacher)} />
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;