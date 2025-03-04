import apiClient from '@/api/api';

/**
 * 文件上传响应接口
 */
interface PresignedUrlResponse {
  url: string;
  fileUrl: string;
}

/**
 * 上传文件到 Amazon S3
 * @param file 要上传的文件
 * @returns 上传成功后的文件 URL
 */
export async function uploadFile(file: File): Promise<string> {
  try {
    // 获取预签名 URL
    // apiClient 的响应拦截器已经提取了 response.data.data
    const presignedData = await apiClient.post<PresignedUrlResponse, PresignedUrlResponse>('/upload/presigned-url', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });

    // 使用预签名 URL 上传文件
    const uploadResponse = await fetch(presignedData.url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type
      },
      body: file
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    // 返回可访问的文件 URL
    return presignedData.fileUrl;
  } catch (error) {
    console.error('upload file error', error);
    throw new Error(error instanceof Error ? error.message : 'upload file failed');
  }
}

/**
 * 上传图片到 Amazon S3
 * @param file 要上传的图片文件
 * @returns 上传成功后的图片 URL
 */
export async function uploadImage(file: File): Promise<string> {
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files can be uploaded');
  }
  
  return uploadFile(file);
}

/**
 * 从 Base64 字符串创建文件并上传
 * @param base64Data Base64 编码的图片数据
 * @param fileName 文件名
 * @returns 上传成功后的图片 URL
 */
export async function uploadBase64Image(base64Data: string, fileName: string): Promise<string> {
  // 从 Base64 创建 Blob
  const byteString = atob(base64Data.split(',')[1]);
  const mimeType = base64Data.match(/data:([^;]+);/)?.[1] || 'image/jpg';
  
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  
  const blob = new Blob([arrayBuffer], { type: mimeType });
  const file = new File([blob], fileName, { type: mimeType });
  
  return uploadImage(file);
}
  