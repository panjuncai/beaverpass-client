import { gql } from "@apollo/client";

export const GET_PRESIGNED_URL = gql`
  mutation GetPresignedUrl($input: PresignedUrlInput!) {
    getPresignedUrl(input: $input) {
      url
      fileUrl
    }
  }
`;
