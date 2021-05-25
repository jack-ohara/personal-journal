interface BackblazeB2Authorization {
  apiUrl: string;
  authorizationToken: string;
  downloadUrl: string;
}

export default class BackblazeB2Client {
  private applicationKeyId: string | undefined;
  private applicationKey: string | undefined;
  private authorization: BackblazeB2Authorization | undefined;

  public constructor() {
    this.applicationKeyId = process.env.KEY_ID;
    this.applicationKey = process.env.APPLICATION_KEY;
  }

  public uploadFile = async (base64File: string) => {
    const token = await this.getAuthToken();

    console.log(token);
  };

  private getAuthToken = async () => {
    if (!this.authorization) {
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
      }
    }

    return this.authorization?.authorizationToken;
  };
}
