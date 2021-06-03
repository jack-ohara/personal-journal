import createEntry from "../../../backblaze-b2/create-entry";
import getEntry from "../../../personal-journal/get-entry";
import { NextApiRequest, NextApiResponse } from "next";
import { decryptFile, encryptFile } from "../../../utils/file-encryption";

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

      if (!process.env.ENCRYPTION_PASSWORD) {
        console.error("Encryption password not found");
        res.status(500).json({ message: "Encryption password not found" });

        return;
      }

      const decryptedFile = decryptFile(
        Buffer.from(entry, "base64").toString("utf-8"),
        process.env.ENCRYPTION_PASSWORD
      );

      res
        .status(200)
        .json({ entry: Buffer.from(decryptedFile).toString("base64") });
    } else if (req.method === "POST") {
      const request: CreateEntryRequest = JSON.parse(req.body);

      if (!process.env.ENCRYPTION_PASSWORD) {
        console.error("Encryption password not found");
        res.status(500).json({ message: "Encryption password not found" });

        return;
      }

      const encryptedFile = encryptFile(
        Buffer.from(request.file, "base64").toString(),
        process.env.ENCRYPTION_PASSWORD
      );

      await createEntry(entryName, encryptedFile);

      res.status(201).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};
