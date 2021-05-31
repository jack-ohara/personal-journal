import useSWR from "swr";
import fetcher from "../utils/fetch";

interface SwrReponse {
  entry: string | undefined;
  isLoading: boolean;
  isError: boolean;
}

interface EntryResponse {
  entry: string | undefined;
}

export function useEntry(entryName: string): SwrReponse {
  const { data, error } = useSWR<EntryResponse>(
    `/api/entries/${encodeURIComponent(entryName)}`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return {
    entry: data?.entry ? atob(data.entry) : undefined,
    isLoading: !error && !data,
    isError: error,
  };
}
