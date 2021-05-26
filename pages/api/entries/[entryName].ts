import createEntry from "../../../personal-journal/create-entry";
import getEntry from "../../../personal-journal/get-entry";
import { NextApiRequest, NextApiResponse } from "next";

interface CreateEntryRequest {
  file: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { entryName } = req.query;

    if (Array.isArray(entryName)) {
      res.status(400).json({ message: "The filename must be a single string" });

      return;
    }

    if (req.method === "GET") {
      const entry = await getEntry(entryName);

      if (!entry) {
        res.status(404).json({ message: `Entry not found: ${entryName}` });

        return;
      }

      res.status(200).json({ entry });
    } else if (req.method === "POST") {
      const request: CreateEntryRequest = JSON.parse(req.body);

      await createEntry(entryName, request.file);

      res.status(201).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};
