import { gql } from "@apollo/client";

export const GET_PRESIGNED_URL_MUTATION = gql`
  mutation GetPresignedUrl($fileName: String!, $fileType: String!, $fileSize: Int) {
    getPresignedUrl(fileName: $fileName, fileType: $fileType, fileSize: $fileSize) {
      url
      fileUrl
    }
  }
`;
