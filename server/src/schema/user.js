export default `
type User {
  id: Int!
  username: String!
  email: String!
  teams: [Team!]!
}

type Query {
  me: User! #returns user after insert
  allUsers: [User!]! #returns user after insert
  getUser(userId: Int): User
}

type Mutation {
  register(
    username: String!
    email: String!
    password: String!
  ): RegisterResponse! #returns user after insert
  login(email: String!, password: String): LoginResponse!
}

type LoginResponse {
  ok: Boolean!
  token: String
  refreshToken: String
  errors: [Error!]
}

type RegisterResponse {
  ok: Boolean!
  user: User
  errors: [Error!]
}
`;
