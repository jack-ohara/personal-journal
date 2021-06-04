import { format } from "date-fns";
import { useAppContext } from "../utils/state";

const generateTodaysEntryFileName = () => {
  const dateTime = new Date();
  const { user } = useAppContext();

  return `${user?.email}/${format(dateTime, "yyyy")}/${format(
    dateTime,
    "MMM"
  )}/${format(dateTime, "do")}.txt`;
};

export default generateTodaysEntryFileName;
