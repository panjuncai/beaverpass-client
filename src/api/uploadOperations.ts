import { gql } from "@apollo/client";

export const GET_PRESIGNED_URL = gql`
  mutation GetPresignedUrl($input: UploadReq!) {
    getPresignedUrl(input: $input) {
      url
      fileUrl
    }
  }
`;
