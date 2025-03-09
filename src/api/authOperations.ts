import { gql } from '@apollo/client';

// 用户片段
export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    firstName
    lastName
    avatar
    address
    phone
    createdAt
    updatedAt
  }
`;

// 查询
export const CHECK_SESSION = gql`
  query CheckSession {
    checkSession {
      code
      msg
      data {
        ...UserFields
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      code
      msg
      data {
        ...UserFields
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      code
      msg
      data {
        ...UserFields
      }
    }
  }
  ${USER_FRAGMENT}
`;

// 变更
export const LOGIN = gql`
  mutation Login($input: LoginReq!) {
    login(input: $input) {
      code
      msg
      data {
        ...UserFields
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const REGISTER = gql`
  mutation Register($input: RegisterReq!) {
    register(input: $input) {
      code
      msg
      data {
        ...UserFields
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      code
      msg
      data {
        ...UserFields
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $firstName: String
    $lastName: String
    $avatar: String
    $address: String
    $phone: String
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      avatar: $avatar
      address: $address
      phone: $phone
    ) {
      code
      msg
      data {
        ...UserFields
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const VERIFY_USER = gql`
  mutation VerifyUser($verificationToken: String!) {
    verifyUser(verificationToken: $verificationToken) {
      code
      msg
      data {
        ...UserFields
      }
    }
  }
  ${USER_FRAGMENT}
`; 