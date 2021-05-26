export interface BackblazeB2Authorization {
  apiUrl: string;
  authorizationToken: string;
  downloadUrl: string;
}

export interface GetUploadUrlResponse {
  uploadUrl: string;
  authorizationToken: string;
}
