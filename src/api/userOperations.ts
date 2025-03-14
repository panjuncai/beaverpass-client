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