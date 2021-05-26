import sha1 from "sha1";
import { BackblazeB2Authorization, GetUploadUrlResponse } from "./backblaze-b2";

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

  public uploadFile = async (base64File: string) => {
    const getUploadUrlResponse = await this.getUploadUrl();

    await this.uploadFileInternal(
      getUploadUrlResponse.uploadUrl,
      getUploadUrlResponse.authorizationToken,
      base64File
    );
  };

  private uploadFileInternal = async (
    uploadUrl: string,
    authorizationToken: string,
    file: string
  ) => {
    const headers = {
      Authorization: authorizationToken,
      "X-Bz-File-Name": "a-test-entry.txt",
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
        console.log("Uploaded!");
      } else {
        console.error(response);
        throw new Error(`Failed to upload file: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      throw error;
    }
  };

  private getUploadUrl = async () => {
    const authToken = await this.getAuthToken();
    const apiUrl = await this.getApiUrl();

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

        console.log(getUploadUrlResponse);

        return getUploadUrlResponse;
      } else {
        console.error(response);
        throw new Error(
          `Failed to retrieve the get_upload_url: ${JSON.stringify(response)}`
        );
      }
    } catch (error) {
      throw error;
    }
  };

  private getAuthToken = async () => {
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
    } else {
      console.error(response);
      throw new Error(
        `Unable to retrieve authorisation: ${JSON.stringify(response)}`
      );
    }
  };
}
