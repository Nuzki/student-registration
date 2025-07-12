# 📚 Student Registration & Management System

A full-stack MERN (MongoDB, Express, React, Node.js) web application that allows teachers to register, manage, edit, and delete student information, including subject-wise marks.

---

## 🚀 Features

### 👩‍🏫 Teacher Dashboard
- View all registered students.
- Edit student details like:
  - First Name
  - Last Name
  - Email
  - Subject-wise marks (JSON format)
- Delete a student permanently.

### 🎓 Student Management
- Add new students with validations:
  - Email format
  - Unique email and address
  - Age must be greater than 18
  - Name must contain only alphabets
- Store profile picture URL, address, and age.

### 🔐 Authentication & Authorization
- Secure login and signup for both teachers and students.
- JWT-based session management.
- Role-based filtering (only `student` role shown in Teacher Dashboard).

### 📨 Email Notifications
- Sends confirmation email upon successful student signup using Gmail and Nodemailer.

### 📦 Persistent Storage
- MongoDB used for storing all user data including:
  - Personal details
  - Marks (JSON)
  - Authentication data

---

## 🛠️ Tech Stack

| Technology     | Purpose                     |
|----------------|-----------------------------|
| React          | Frontend UI                 |
| Apollo Client  | GraphQL client for React    |
| Node.js        | Backend runtime             |
| Express.js     | Web server for APIs         |
| Apollo Server  | GraphQL API layer           |
| MongoDB        | Database                    |
| Mongoose       | ODM for MongoDB             |
| GraphQL        | Data query language         |
| Nodemailer     | Email notifications         |
| JSON Web Token | Authentication (JWT)        |
| Tailwind CSS   | UI styling (optional)       |

---

## 🧪 Validation Rules

- `firstName` and `lastName`: Alphabets only (regex validated).
- `email`: Must be valid format and unique.
- `age`: Must be greater than 18.
- `address`: Unique field for every user.
- `marks`: Accepts JSON format (e.g., `{ "math": 80, "english": 90 }`).


---

## 🔗 Resources & References

The following tools and online documentation were used while developing this application:

### 🔍 Official Docs
- [React](https://reactjs.org/docs/getting-started.html)
- [Apollo Client & Server](https://www.apollographql.com/docs/)
- [GraphQL](https://graphql.org/)
- [Mongoose](https://mongoosejs.com/docs/)
- [Nodemailer](https://nodemailer.com/about/)
- [JWT](https://jwt.io/introduction/)
- [dotenv](https://www.npmjs.com/package/dotenv)

### 🧑‍💻 Community Help
- [Stack Overflow](https://stackoverflow.com/)
- [FreeCodeCamp](https://www.freecodecamp.org/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [GeeksforGeeks GraphQL Tutorials](https://www.geeksforgeeks.org/graphql/)
- [YouTube Tutorials (Traversy Media, Net Ninja)](https://www.youtube.com/)


