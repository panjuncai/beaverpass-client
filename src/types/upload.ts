export interface PresignedUrlRsp {
    url: string;
    fileUrl: string;
}

export interface UploadReq{
    fileName: string;
    fileType: string;
    fileSize: number;
}