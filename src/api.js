import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const operations = {
  signup: {
    type: 'mutation',
    gql: `
      mutation Signup(
        $firstName: String!,
        $lastName: String!,
        $email: String!,
        $password: String!,
        $age: Int!,
        $address: String!,
        $role: String!
      ) {
        signup(
          firstName: $firstName,
          lastName: $lastName,
          email: $email,
          password: $password,
          age: $age,
          address: $address,
          role: $role
        ) {
          message
          token
        }
      }
    `,
  },
  login: {
    type: 'mutation',
    gql: `
      mutation Login($email: String!, $password: String!, $role: String!) {
        login(email: $email, password: $password, role: $role) {
          message
          token
        }
      }
    `,
  },
  updateMarks: {
    type: 'mutation',
    gql: `
      mutation UpdateMarks($id: ID!, $marks: JSON!) {
        updateMarks(id: $id, marks: $marks) {
          message
          data {
            id
            marks
          }
        }
      }
    `,
  },
  updateStudent: {
    type: 'mutation',
    gql: `
      mutation UpdateStudent(
        $id: ID!,
        $firstName: String,
        $lastName: String,
        $email: String,
        $password: String,
        $age: Int,
        $address: String,
        $marks: JSON,
        $profilePic: String,
        $role: String
      ) {
        updateStudent(
          id: $id,
          firstName: $firstName,
          lastName: $lastName,
          email: $email,
          password: $password,
          age: $age,
          address: $address,
          marks: $marks,
          profilePic: $profilePic,
          role: $role
        ) {
          message
          data {
            id
            firstName
          }
        }
      }
    `,
  },
  deleteStudent: {
    type: 'mutation',
    gql: `
      mutation DeleteStudent($id: ID!) {
        deleteStudent(id: $id) {
          message
        }
      }
    `,
  },
  getAllStudents: {
    type: 'query',
    gql: `
      query GetAllStudents {
        getAllStudents {
          id
          firstName
          lastName
        }
      }
    `,
  },
};

const fetchDataAsync = async (operation, variables) => {
  if (!operations[operation]) {
    throw new Error(`Unknown operation: ${operation}`);
  }
  const { type, gql: operationGql } = operations[operation];
  if (type === 'mutation') {
    const result = await client.mutate({
      mutation: gql`${operationGql}`,
      variables,
    });
    return result.data;
  }
  if (type === 'query') {
    const result = await client.query({
      query: gql`${operationGql}`,
      variables,
      fetchPolicy: 'no-cache',
    });
    return result.data;
  }
  throw new Error('Unknown operation type');
};

export default fetchDataAsync;
