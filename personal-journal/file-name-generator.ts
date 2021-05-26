import { format } from "date-fns";

const generateFileName = () => {
  const dateTime = new Date();

  return `${format(dateTime, "yyyy-MM-dd")}.txt`;
};

export default generateFileName;
