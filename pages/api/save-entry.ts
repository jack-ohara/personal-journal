import BackblazeB2Client from "../../backblaze-b2/backblaze-b2-client";
import generateFileName from "../../personal-journal/file-name-generator";
import type { NextApiRequest, NextApiResponse } from "next";

interface SaveEntryRequest {
  file: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const request: SaveEntryRequest = JSON.parse(req.body);

    const bbClient = new BackblazeB2Client();

    await bbClient.uploadFile(request.file, generateFileName());

    res.status(201).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};
