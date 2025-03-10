import { PresignedUrlRsp, UploadReq } from "@/types/upload";
import { useMutation } from "@apollo/client";
import { GET_PRESIGNED_URL } from "@/api/uploadOperations";
import { Toast } from "antd-mobile";

export const useUpload = () => {
    const [upLoadMutation, { loading }] = useMutation<
      { getPresignedUrl: PresignedUrlRsp},
      { input: UploadReq }
    >(GET_PRESIGNED_URL);
  
    const upload = async (input: UploadReq) => {
      try {
        const { data, errors } = await upLoadMutation({
          variables: { input },
        });

        if (errors && errors.length > 0) {
            throw new Error(errors[0].message || 'upload failed.');   
        }
  
        if (!data || !data.getPresignedUrl.fileUrl||!data.getPresignedUrl.url) {
          Toast.show({
            icon: 'fail',
            content: 'upload failed.',
          });
          throw new Error('upload failed.');
        }
  
        return {
            url: data.getPresignedUrl.url,
            fileUrl: data.getPresignedUrl.fileUrl,
        };
      } catch (error) {
        console.error('upload failed:', error);
        throw error;
      }
    };
  
    return {
      upload,
      isLoading: loading,
    };
  };
  