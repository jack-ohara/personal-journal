import BackblazeB2Client from "../backblaze-b2/backblaze-b2-client";

const getAllEntries = async (
  prefix: string | undefined,
  delimeter: string | undefined
) => {
  const bbClient = new BackblazeB2Client();

  const allFiles = await bbClient.listFiles(prefix, delimeter);

  return allFiles.map((e) => e.fileName);
};

export default getAllEntries;
