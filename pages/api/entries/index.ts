import { NextApiRequest, NextApiResponse } from "next";
import getAllEntries from "../../../personal-journal/get-all-entries";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      const { prefix, delimiter } = req.query;

      if (Array.isArray(prefix)) {
        res.status(400).json({ error: "Prefix must be a single string" });
        return;
      }

      if (Array.isArray(delimiter)) {
        res.status(400).json({ error: "Delimiter must be a single string" });
        return;
      }

      const result = await getAllEntries(prefix, delimiter);

      res.status(200).json({ entries: result });
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};
