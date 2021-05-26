import sha1 from "sha1";
import {
  BackblazeB2Authorization,
  GetUploadUrlResponse,
  ListFileNamesResponse,
} from "./backblaze-b2";

export default class BackblazeB2Client {
  private applicationKeyId: string | undefined;
  private applicationKey: string | undefined;
  private bucketId: string | undefined;
  private authorization: BackblazeB2Authorization | undefined;

  public constructor() {
    this.applicationKeyId = process.env.KEY_ID;
    this.applicationKey = process.env.APPLICATION_KEY;
    this.bucketId = process.env.BUCKET_ID;
  }

  public getFile = async (entryName: string) => {
    const authToken = await this.getAuthToken();
    const downloadUrl = await this.getDownloadUrl();
    const bucketName = await this.getBucketName();

    if (!authToken) {
      throw new Error(`No auth token found`);
    }

    const headers = {
      Authorization: authToken,
    };

    const url = `${downloadUrl}/file/${bucketName}/${entryName}`;

    console.debug(`GET ${url}`);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (response.ok) {
        const blob = await response.blob();
        const file = await blob.text();

        console.log(`Successfully downloaded ${entryName} from backblaze`);

        return file;
      } else if (response.status === 404) {
        console.debug(`File not found in backblaze: ${entryName}`);

        return null;
      } else {
        console.error(response);
        throw new Error(
          `Failed to download file ${entryName}: ${JSON.stringify(response)}`
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  public uploadFile = async (fileName: string, base64File: string) => {
    const getUploadUrlResponse = await this.getUploadUrl();

    await this.uploadFileInternal(
      fileName,
      getUploadUrlResponse.uploadUrl,
      getUploadUrlResponse.authorizationToken,
      base64File
    );
  };

  public listFiles = async (
    prefix: string | undefined,
    delimeter: string | undefined
  ) => {
    const authToken = await this.getAuthToken();
    const apiUrl = await this.getApiUrl();

    console.debug("Retreiving file names from backblaze");

    if (!authToken) {
      throw new Error(`No auth token found`);
    }

    const headers = {
      Authorization: authToken,
    };

    const body = {
      bucketId: this.bucketId,
      prefix: prefix,
      delimeter: delimeter,
    };

    const url = `${apiUrl}/b2api/v2/b2_list_file_names`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const listFileNamesResponse: ListFileNamesResponse =
          await response.json();

        console.log(
          `Successfully retrieved ${listFileNamesResponse.files.length} file names from backblaze`
        );

        return listFileNamesResponse.files;
      } else {
        console.error(response);
        throw new Error(`Failed to list files: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  private uploadFileInternal = async (
    fileName: string,
    uploadUrl: string,
    authorizationToken: string,
    file: string
  ) => {
    console.debug(`Starting file upload. Uploading: ${fileName}`);

    const headers = {
      Authorization: authorizationToken,
      "X-Bz-File-Name": fileName,
      "Content-Type": "text/plain",
      "Content-Length": file.length.toString(),
      "X-Bz-Content-Sha1": sha1(file),
    };

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: headers,
        body: file,
      });

      if (response.ok) {
        console.log(`Successfully uploaded ${fileName} to backblaze!`);
      } else {
        console.error(response);
        throw new Error(`Failed to upload file: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  private getUploadUrl = async () => {
    const authToken = await this.getAuthToken();
    const apiUrl = await this.getApiUrl();

    console.debug("Retrieving upload URL from backblaze");

    if (!authToken) {
      throw new Error(`No auth token found`);
    }

    const headers = {
      Authorization: authToken,
    };

    const body = {
      bucketId: this.bucketId,
    };

    const url = `${apiUrl}/b2api/v2/b2_get_upload_url`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const getUploadUrlResponse: GetUploadUrlResponse =
          await response.json();

        console.debug("Successfully retrieved upload URL from backblaze");

        return getUploadUrlResponse;
      } else {
        console.error(response);
        throw new Error(
          `Failed to retrieve the get_upload_url: ${JSON.stringify(response)}`
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  private getAuthToken = async () => {
    console.debug("Generating auth from backblaze...");

    if (!this.authorization) {
      await this.getAuthorisation();
    }

    return this.authorization?.authorizationToken;
  };

  private getApiUrl = async () => {
    if (!this.authorization) {
      await this.getAuthorisation();
    }

    return this.authorization?.apiUrl;
  };

  private getDownloadUrl = async () => {
    if (!this.authorization) {
      await this.getAuthorisation();
    }

    return this.authorization?.downloadUrl;
  };

  private getBucketName = async () => {
    if (!this.authorization) {
      await this.getAuthorisation();
    }

    return this.authorization?.allowed.bucketName;
  };

  private getAuthorisation = async () => {
    const credentials = Buffer.from(
      `${this.applicationKeyId}:${this.applicationKey}`
    ).toString("base64");

    var response = await fetch(
      "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "content-type": "application/json; charset=utf-8",
        },
      }
    );

    if (response.ok) {
      this.authorization = await response.json();

      console.debug("Successfully received auth from backblaze");
    } else {
      console.error(response);
      throw new Error(
        `Unable to retrieve authorisation: ${JSON.stringify(response)}`
      );
    }
  };
}
