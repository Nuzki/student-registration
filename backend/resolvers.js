const { GraphQLJSON } = require('graphql-type-json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('./models/User');

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getStudent: async (_, { id }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      try {
        const student = await User.findById(id);
        if (!student) throw new Error('Student not found');
        if (student.role !== 'student' || user.role !== 'teacher') throw new Error('Access denied');
        return student;
      } catch (error) {
        throw new Error('Failed to fetch student: ' + error.message);
      }
    },
    getAllStudents: async (_, __, { user }) => {
      if (!user || user.role !== 'teacher') throw new Error('Unauthorized');
      try {
        const students = await User.find({ role: 'student' });
        return students;
      } catch (error) {
        throw new Error('Failed to fetch students: ' + error.message);
      }
    },
  },
  Mutation: {
    login: async (_, { email, password, role }) => {
      console.log('Login attempt:', { email, password, role });
      if (!email || !password || !role) throw new Error('Email, password, and role are required');
      const user = await User.findOne({ email, role });
      if (!user || !bcrypt.compareSync(password, user.password)) throw new Error('Invalid credentials');
      const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { message: 'Login successful', token, data: user };
    },
    signup: async (_, { firstName, lastName, email, password, age, address, role }) => {
      console.log('Signup attempt:', { firstName, lastName, email, password, age, address, role });
      if (!firstName || !lastName || !email || !password || !age || !address || !role) throw new Error('All fields are required');
      if (age <= 18) throw new Error('Age must be greater than 18');
      const existingEmail = await User.findOne({ email });
      if (existingEmail) throw new Error('Email must be unique');
      const existingAddress = await User.findOne({ address });
      if (existingAddress) throw new Error('Address must be unique');
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await User.create({ firstName, lastName, email, password: hashedPassword, age, address, role, marks: {}, profilePic: '' });
      const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
      await transporter.sendMail({ from: process.env.EMAIL_USER, to: email, subject: 'Registration Successful', text: 'Welcome to the system!' });
      return { message: 'Signup successful', token, data: user };
    },
    updateMarks: async (_, { id, marks }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      try {
        if (!marks || typeof marks !== 'object') throw new Error('Marks must be a valid JSON object');
        const student = await User.findById(id);
        if (!student) throw new Error('Student not found');
        if (student.role !== 'student') throw new Error('Can only update marks for students');
        const updatedUser = await User.findByIdAndUpdate(id, { marks }, { new: true, runValidators: true });
        return {
          message: 'Marks updated successfully',
          token: jwt.sign({ id: updatedUser._id, role: updatedUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' }),
          data: updatedUser,
        };
      } catch (error) {
        throw new Error('Failed to update marks: ' + error.message);
      }
    },
    updateStudent: async (_, args, { user }) => {
      if (!user) throw new Error('Unauthorized');
      try {
        const student = await User.findById(args.id);
        if (!student) throw new Error('Student not found');
        if (student.role !== 'student' || user.role !== 'teacher') throw new Error('Access denied');
        const updatedUser = await User.findByIdAndUpdate(args.id, args, { new: true, runValidators: true });
        const teachers = await User.find({ role: 'teacher' });
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        for (const teacher of teachers) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: teacher.email,
            subject: 'Student Profile Updated',
            text: `Student ${student.firstName} ${student.lastName} has updated their profile and marks. Email: ${student.email}`,
          });
        }
        return {
          message: 'Student updated successfully',
          token: jwt.sign({ id: updatedUser._id, role: updatedUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' }),
          data: updatedUser,
        };
      } catch (error) {
        throw new Error('Failed to update student: ' + error.message);
      }
    },
    deleteStudent: async (_, { id }, { user }) => {
      if (!user || user.role !== 'teacher') throw new Error('Unauthorized');
      try {
        const student = await User.findById(id);
        if (!student) throw new Error('Student not found');
        await User.findByIdAndDelete(id);
        return { message: 'Student deleted successfully', token: jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' }), data: null };
      } catch (error) {
        throw new Error('Failed to delete student: ' + error.message);
      }
    },
  },
};

module.exports = { resolvers };