import BackblazeB2Client from "../backblaze-b2/backblaze-b2-client";

const getEntry = (entryName: string) => {
  const bbClient = new BackblazeB2Client();

  return bbClient.getFile(entryName);
};

export default getEntry;
