import { NextApiRequest, NextApiResponse } from "next";
import getAllEntries from "../../../personal-journal/get-all-entries";

interface GetEntriesRequest {
  prefix: string | undefined;
  delimeter: string | undefined;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      const request: GetEntriesRequest = JSON.parse(req.body);

      const result = await getAllEntries(request.prefix, request.delimeter);

      res.status(201).json({ entries: result });
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};
