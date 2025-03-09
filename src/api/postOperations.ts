import { gql } from '@apollo/client';

// 帖子片段
export const POST_FRAGMENT = gql`
  fragment PostFields on Post {
    id
    category
    title
    description
    condition
    images {
      FRONT
      SIDE
      BACK
      DAMAGE
    }
    price {
      amount
      isFree
      isNegotiable
    }
    deliveryType
    poster {
      id
      firstName
      lastName
      email
      avatar
    }
    status
    createdAt
    updatedAt
  }
`;

// 查询
export const GET_POSTS_BY_FILTER = gql`
  query GetPostsByFilter($filter: PostFilterInput) {
    getPostsByFilter(filter: $filter) {
      code
      msg
      data {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    getPostById(id: $id) {
      code
      msg
      data {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_POSTS_BY_POSTER_ID = gql`
  query GetPostsByPosterId($posterId: ID!) {
    getPostsByPosterId(posterId: $posterId) {
      code
      msg
      data {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_MY_POSTS = gql`
  query GetMyPosts {
    getMyPosts {
      code
      msg
      data {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`;

// 变更
export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      code
      msg
      data {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      code
      msg
      data {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const UPDATE_POST_STATUS = gql`
  mutation UpdatePostStatus($id: ID!, $status: PostStatus!) {
    updatePostStatus(id: $id, status: $status) {
      code
      msg
      data {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      code
      msg
      data {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`; 