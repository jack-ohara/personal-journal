import type { NextApiRequest, NextApiResponse } from "next";
import BackblazeB2Client from "../../backblaze-b2/backblaze-b2-client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);

  const bbClient = new BackblazeB2Client();

  await bbClient.uploadFile(body.file);

  res.status(200).json({ body: req.body });
};
