import useSWR from "swr";
import fetcher from "./fetch";

interface SwrReponse {
  quote: StoicQuoteResponse | undefined;
  isLoading: boolean;
  isError: boolean;
}

interface StoicQuoteResponse {
  body: string;
  author: string;
}

export default function getRandomQuote(): SwrReponse {
  const { data, error } = useSWR<StoicQuoteResponse>(
    "https://stoicquotesapi.com/v1/api/quotes/random",
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return {
    quote: data,
    isLoading: !error && !data,
    isError: error,
  };
}

// TODO
// Write in a retry for 500 or 503 response
// Figure out why I'm getting 'malformed utf-8 data' errors on live
