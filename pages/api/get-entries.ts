import { NextApiRequest, NextApiResponse } from "next";
import BackblazeB2Client from "../../backblaze-b2/backblaze-b2-client";

interface GetEntriesRequest {
  prefix: string | undefined;
  delimeter: string | undefined;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const request: GetEntriesRequest = JSON.parse(req.body);

    const bbClient = new BackblazeB2Client();

    const entryNames = await bbClient.listFiles(
      request.prefix,
      request.delimeter
    );

    res.status(201).json({ entries: entryNames.map((e) => e.fileName) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};
