import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    login(email: String, password: String): String
    verify(email: String, token: String): String
  }

  # User
  type User {
    id: ID
    email: String
    password: String
  }

  # Mutation
  type Mutation {
    create(email: String, password: String): Boolean
    change(email: String, newPassword: String, oldPassword: String): Boolean
  }
`;

export default typeDefs;
