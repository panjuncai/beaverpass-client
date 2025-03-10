import { PresignedUrlResponse } from "@/types/upload";
import { useMutation } from "@apollo/client";
import { GET_PRESIGNED_URL_MUTATION } from "@/api/uploadOperations";
import { Toast } from "antd-mobile";

export const useUpload = () => {
    const [upLoadMutation, { loading }] = useMutation<
      { upLoad: PresignedUrlResponse},
      { input: {fileName: string, fileType: string, fileSize: number} }
    >(GET_PRESIGNED_URL_MUTATION);
  
    const upload = async (input: {fileName: string, fileType: string, fileSize: number}) => {
      try {
        const { data,errors} = await upLoadMutation({
          variables: { input },
        });

        if (errors && errors.length > 0) {
            throw new Error(errors[0].message || 'upload failed.');   
        }
  
        if (!data || !data.upLoad.fileUrl||!data.upLoad.url) {
          Toast.show({
            icon: 'fail',
            content: 'upload failed.',
          });
          throw new Error('upload failed.');
        }
  
        return {
            url: data.upLoad.url,
            fileUrl: data.upLoad.fileUrl,
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
  