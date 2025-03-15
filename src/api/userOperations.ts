import {gql} from '@apollo/client';

export const USER_FRAGMENT = gql`
    fragment UserFields on User {
        id
        email
        firstName
        lastName
        avatar
        address
        phone
    }
`

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        me {
            ...UserFields
        }
    }
    ${USER_FRAGMENT}
`

export const GET_USER_BY_ID = gql`
    query GetUserById($id: String!) {
        user(id: $id) {
            ...UserFields
        }
    }
    ${USER_FRAGMENT}
`