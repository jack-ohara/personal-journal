export interface BackblazeB2Authorization {
  apiUrl: string;
  authorizationToken: string;
  downloadUrl: string;
  allowed: AllowedBackblazeB2Access;
}

interface AllowedBackblazeB2Access {
  bucketName: string;
}

export interface GetUploadUrlResponse {
  uploadUrl: string;
  authorizationToken: string;
}

export interface ListFileNamesResponse {
  files: ListFileNamesFile[];
  nextFileName: string | undefined;
}

export interface ListFileNamesFile {
  fileName: string;
}
