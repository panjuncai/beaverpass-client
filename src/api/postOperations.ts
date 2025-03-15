import { gql } from '@apollo/client';

// 帖子片段
export const POST_FRAGMENT = gql`
  fragment PostFields on Post {
    id
    category
    title
    description
    condition
    amount
    isNegotiable
    deliveryType
    poster {
      id
      email
      avatar
    }
    posterId
    status
    createdAt
    updatedAt
    images {
      id
      postId
      imageUrl
      imageType
      createdAt
    }
  }
`;

// 查询
export const GET_POSTS_BY_FILTER = gql`
  query GetPostsByFilter($filter: PostFilterInput) {
    getPostsByFilter(filter: $filter) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    getPostById(id: $id) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_POSTS_BY_POSTER_ID = gql`
  query GetPostsByPosterId($posterId: ID!) {
    getPostsByPosterId(posterId: $posterId) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_MY_POSTS = gql`
  query GetMyPosts {
    getMyPosts {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;

// 变更
export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;

export const UPDATE_POST_STATUS = gql`
  mutation UpdatePostStatus($id: ID!, $status: String!) {
    updatePostStatus(id: $id, status: $status) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;

// 帖子图片操作
export const ADD_POST_IMAGE = gql`
  mutation AddPostImage($input: AddPostImageInput!) {
    addPostImage(input: $input) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;

export const DELETE_POST_IMAGE = gql`
  mutation DeletePostImage($input: DeletePostImageInput!) {
    deletePostImage(input: $input) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`; 