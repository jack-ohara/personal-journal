import { format } from "date-fns";

const generateTodaysEntryFileName = () => {
  const dateTime = new Date();

  return `${format(dateTime, "yyyy")}/${format(dateTime, "MMM")}/${format(
    dateTime,
    "do"
  )}.txt`;
};

export default generateTodaysEntryFileName;
