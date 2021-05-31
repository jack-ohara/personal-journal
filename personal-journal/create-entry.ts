import BackblazeB2Client from "../backblaze-b2/backblaze-b2-client";

const createEntry = async (entryName: string, contents: string) => {
  const bbClient = new BackblazeB2Client();

  await bbClient.uploadFile(
    entryName,
    Buffer.from(contents).toString("base64")
  );
};

export default createEntry;
