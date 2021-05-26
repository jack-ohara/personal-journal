import { NextApiRequest, NextApiResponse } from "next";
import createEntry from "../../../personal-journal/create-entry";

interface CreateEntryRequest {
  file: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      res.status(200).end();
    } else if (req.method === "POST") {
      const request: CreateEntryRequest = JSON.parse(req.body);
      const { entryName } = req.query;

      if (Array.isArray(entryName)) {
        res
          .status(400)
          .json({ message: "The filename must be a single string" });

        return;
      }

      await createEntry(entryName, request.file);

      res.status(201).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};
