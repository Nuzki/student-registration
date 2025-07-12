const { gql } = require('apollo-server-express');
const { GraphQLJSON } = require('graphql-type-json');

const typeDefs = gql`
  scalar JSON
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    age: Int!
    address: String!
    marks: JSON
    profilePic: String
    role: String!
  }
  type LoginResponse {
    message: String!
    token: String!
    data: User
  }
  type Mutation {
    login(email: String!, password: String!, role: String!): LoginResponse!
    signup(firstName: String!, lastName: String!, email: String!, password: String!, age: Int!, address: String!, role: String!): LoginResponse!
    updateMarks(id: ID!, marks: JSON!): LoginResponse!
    updateStudent(id: ID!, firstName: String, lastName: String, email: String, password: String, age: Int, address: String, marks: JSON, profilePic: String, role: String): LoginResponse!
    deleteStudent(id: ID!): LoginResponse!
  }
  type Query {
    getStudent(id: ID!): User!
    getAllStudents: [User!]!
  }
`;
module.exports = { typeDefs };