import useSWR from "swr";
import fetcher from "../utils/fetch";

interface SwrReponse {
  entries: string[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

interface EntriesResponse {
  entries: string[] | undefined;
}

export function useEntries(prefix: string, delimiter: string): SwrReponse {
  const { data, error } = useSWR<EntriesResponse>(
    `api/entries?prefix=${encodeURIComponent(
      prefix
    )}&delimiter=${encodeURIComponent(delimiter)}`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return {
    entries: data?.entries,
    isLoading: !error && !data,
    isError: error,
  };
}
